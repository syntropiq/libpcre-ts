#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <string>
#include <vector>
#include <memory>
#include <cstring>

extern "C" {
#include "pcre.h"
#include "pcreposix.h"
}

using namespace emscripten;

// RAII wrapper for PCRE compiled regex
class PCRERegex {
private:
    pcre* regex;
    pcre_extra* extra;
    std::string pattern;
    int options;

public:
    PCRERegex(const std::string& pattern, int options = 0) 
        : regex(nullptr), extra(nullptr), pattern(pattern), options(options) {
        
        const char* error;
        int erroffset;
        
        regex = pcre_compile(pattern.c_str(), options, &error, &erroffset, nullptr);
        if (!regex) {
            throw std::runtime_error("PCRE compilation failed: " + std::string(error) + " at offset " + std::to_string(erroffset));
        }
        
        // Study the regex for optimization
        const char* study_error;
        extra = pcre_study(regex, 0, &study_error);
        if (study_error) {
            pcre_free(regex);
            throw std::runtime_error("PCRE study failed: " + std::string(study_error));
        }
    }
    
    ~PCRERegex() {
        if (extra) pcre_free_study(extra);
        if (regex) pcre_free(regex);
    }
    
    // Test if pattern matches
    bool test(const std::string& subject, int start_offset = 0) {
        int result = pcre_exec(regex, extra, subject.c_str(), subject.length(), 
                              start_offset, 0, nullptr, 0);
        return result >= 0;
    }
    
    // Execute and return match information
    val exec(const std::string& subject, int start_offset = 0) {
        const int MAX_CAPTURES = 30;
        int ovector[MAX_CAPTURES * 3];
        
        int result = pcre_exec(regex, extra, subject.c_str(), subject.length(),
                              start_offset, 0, ovector, MAX_CAPTURES * 3);
        
        if (result < 0) {
            return val::null();
        }
        
        val matches = val::array();
        
        // Add full match and captures
        for (int i = 0; i < result; i++) {
            int start = ovector[2 * i];
            int end = ovector[2 * i + 1];
            
            if (start >= 0 && end >= 0) {
                val match = val::object();
                match.set("value", subject.substr(start, end - start));
                match.set("index", start);
                match.set("length", end - start);
                matches.call<void>("push", match);
            } else {
                matches.call<void>("push", val::null());
            }
        }
        
        return matches;
    }
    
    // Get capture group names
    val getNamedGroups() {
        int namecount = 0;
        pcre_fullinfo(regex, extra, PCRE_INFO_NAMECOUNT, &namecount);
        
        if (namecount <= 0) {
            return val::object();
        }
        
        int name_entry_size = 0;
        pcre_fullinfo(regex, extra, PCRE_INFO_NAMEENTRYSIZE, &name_entry_size);
        
        char* name_table = nullptr;
        pcre_fullinfo(regex, extra, PCRE_INFO_NAMETABLE, &name_table);
        
        val groups = val::object();
        
        for (int i = 0; i < namecount; i++) {
            int group_index = (name_table[0] << 8) | name_table[1];
            std::string group_name(name_table + 2);
            groups.set(group_name, group_index);
            name_table += name_entry_size;
        }
        
        return groups;
    }
    
    // Global match (find all matches)
    val globalMatch(const std::string& subject) {
        val allMatches = val::array();
        int offset = 0;
        
        while (offset < static_cast<int>(subject.length())) {
            val match = exec(subject, offset);
            if (match.isNull()) {
                break;
            }
            
            allMatches.call<void>("push", match);
            
            // Move offset past this match
            val firstMatch = match[0];
            if (!firstMatch.isNull()) {
                int matchIndex = firstMatch["index"].as<int>();
                int matchLength = firstMatch["length"].as<int>();
                offset = matchIndex + (matchLength > 0 ? matchLength : 1);
            } else {
                break;
            }
        }
        
        return allMatches;
    }
    
    // Replace functionality
    std::string replace(const std::string& subject, const std::string& replacement, bool global = false) {
        if (global) {
            std::string result = subject;
            int offset = 0;
            
            while (offset < static_cast<int>(result.length())) {
                const int MAX_CAPTURES = 30;
                int ovector[MAX_CAPTURES * 3];
                
                int match_result = pcre_exec(regex, extra, result.c_str(), result.length(),
                                           offset, 0, ovector, MAX_CAPTURES * 3);
                
                if (match_result < 0) break;
                
                int start = ovector[0];
                int end = ovector[1];
                
                // Perform the replacement
                result.replace(start, end - start, replacement);
                offset = start + replacement.length();
            }
            
            return result;
        } else {
            const int MAX_CAPTURES = 30;
            int ovector[MAX_CAPTURES * 3];
            
            int result = pcre_exec(regex, extra, subject.c_str(), subject.length(),
                                  0, 0, ovector, MAX_CAPTURES * 3);
            
            if (result < 0) return subject;
            
            int start = ovector[0];
            int end = ovector[1];
            
            std::string output = subject;
            output.replace(start, end - start, replacement);
            return output;
        }
    }
    
    std::string getPattern() const { return pattern; }
    int getOptions() const { return options; }
};

// Utility functions for PCRE options and info
namespace PCREUtils {
    int getVersion() {
        return PCRE_MAJOR * 100 + PCRE_MINOR;
    }
    
    std::string getVersionString() {
        const char* version = pcre_version();
        return std::string(version);
    }
    
    val getConfigInfo() {
        val config = val::object();
        
        int utf8_support = 0;
        pcre_config(PCRE_CONFIG_UTF8, &utf8_support);
        config.set("utf8", utf8_support != 0);
        
        int unicode_properties = 0;
        pcre_config(PCRE_CONFIG_UNICODE_PROPERTIES, &unicode_properties);
        config.set("unicodeProperties", unicode_properties != 0);
        
        int jit_support = 0;
        pcre_config(PCRE_CONFIG_JIT, &jit_support);
        config.set("jit", jit_support != 0);
        
        int newline = 0;
        pcre_config(PCRE_CONFIG_NEWLINE, &newline);
        config.set("newline", newline);
        
        int link_size = 0;
        pcre_config(PCRE_CONFIG_LINK_SIZE, &link_size);
        config.set("linkSize", link_size);
        
        int match_limit = 0;
        pcre_config(PCRE_CONFIG_MATCH_LIMIT, &match_limit);
        config.set("matchLimit", match_limit);
        
        return config;
    }
}

// Quick test function
bool quickTest(const std::string& pattern, const std::string& subject, int options = 0) {
    try {
        PCRERegex regex(pattern, options);
        return regex.test(subject);
    } catch (...) {
        return false;
    }
}

// Simple match function that returns match array
val quickMatch(const std::string& pattern, const std::string& subject, int options = 0) {
    try {
        PCRERegex regex(pattern, options);
        return regex.exec(subject);
    } catch (...) {
        return val::null();
    }
}

// Bind everything to JavaScript
EMSCRIPTEN_BINDINGS(libpcre) {
    // PCRE constants
    constant("PCRE_CASELESS", PCRE_CASELESS);
    constant("PCRE_MULTILINE", PCRE_MULTILINE);
    constant("PCRE_DOTALL", PCRE_DOTALL);
    constant("PCRE_EXTENDED", PCRE_EXTENDED);
    constant("PCRE_ANCHORED", PCRE_ANCHORED);
    constant("PCRE_DOLLAR_ENDONLY", PCRE_DOLLAR_ENDONLY);
    constant("PCRE_EXTRA", PCRE_EXTRA);
    constant("PCRE_NOTBOL", PCRE_NOTBOL);
    constant("PCRE_NOTEOL", PCRE_NOTEOL);
    constant("PCRE_UNGREEDY", PCRE_UNGREEDY);
    constant("PCRE_NOTEMPTY", PCRE_NOTEMPTY);
    constant("PCRE_UTF8", PCRE_UTF8);
    constant("PCRE_NO_AUTO_CAPTURE", PCRE_NO_AUTO_CAPTURE);
    constant("PCRE_NO_UTF8_CHECK", PCRE_NO_UTF8_CHECK);
    constant("PCRE_AUTO_CALLOUT", PCRE_AUTO_CALLOUT);
    constant("PCRE_PARTIAL_SOFT", PCRE_PARTIAL_SOFT);
    constant("PCRE_PARTIAL", PCRE_PARTIAL_SOFT);
    constant("PCRE_PARTIAL_HARD", PCRE_PARTIAL_HARD);
    constant("PCRE_NOTEMPTY_ATSTART", PCRE_NOTEMPTY_ATSTART);
    constant("PCRE_BSR_ANYCRLF", PCRE_BSR_ANYCRLF);
    constant("PCRE_BSR_UNICODE", PCRE_BSR_UNICODE);
    constant("PCRE_JAVASCRIPT_COMPAT", PCRE_JAVASCRIPT_COMPAT);
    
    // Error codes
    constant("PCRE_ERROR_NOMATCH", PCRE_ERROR_NOMATCH);
    constant("PCRE_ERROR_NULL", PCRE_ERROR_NULL);
    constant("PCRE_ERROR_BADOPTION", PCRE_ERROR_BADOPTION);
    constant("PCRE_ERROR_BADMAGIC", PCRE_ERROR_BADMAGIC);
    constant("PCRE_ERROR_UNKNOWN_OPCODE", PCRE_ERROR_UNKNOWN_OPCODE);
    constant("PCRE_ERROR_UNKNOWN_NODE", PCRE_ERROR_UNKNOWN_NODE);
    constant("PCRE_ERROR_NOMEMORY", PCRE_ERROR_NOMEMORY);
    constant("PCRE_ERROR_NOSUBSTRING", PCRE_ERROR_NOSUBSTRING);
    constant("PCRE_ERROR_MATCHLIMIT", PCRE_ERROR_MATCHLIMIT);
    constant("PCRE_ERROR_CALLOUT", PCRE_ERROR_CALLOUT);
    constant("PCRE_ERROR_BADUTF8", PCRE_ERROR_BADUTF8);
    constant("PCRE_ERROR_BADUTF8_OFFSET", PCRE_ERROR_BADUTF8_OFFSET);
    constant("PCRE_ERROR_PARTIAL", PCRE_ERROR_PARTIAL);
    constant("PCRE_ERROR_BADPARTIAL", PCRE_ERROR_BADPARTIAL);
    constant("PCRE_ERROR_INTERNAL", PCRE_ERROR_INTERNAL);
    constant("PCRE_ERROR_BADCOUNT", PCRE_ERROR_BADCOUNT);
    constant("PCRE_ERROR_RECURSIONLIMIT", PCRE_ERROR_RECURSIONLIMIT);
    constant("PCRE_ERROR_BADNEWLINE", PCRE_ERROR_BADNEWLINE);
    constant("PCRE_ERROR_BADOFFSET", PCRE_ERROR_BADOFFSET);
    constant("PCRE_ERROR_SHORTUTF8", PCRE_ERROR_SHORTUTF8);
    
    // Main PCRERegex class
    class_<PCRERegex>("PCRERegex")
        .constructor<const std::string&>()
        .constructor<const std::string&, int>()
        .function("test", &PCRERegex::test)
        .function("exec", optional_override([](PCRERegex& self, const std::string& subject) {
            return self.exec(subject, 0);
        }))
        .function("exec", optional_override([](PCRERegex& self, const std::string& subject, int start_offset) {
            return self.exec(subject, start_offset);
        }))
        .function("getNamedGroups", &PCRERegex::getNamedGroups)
        .function("globalMatch", &PCRERegex::globalMatch)
        .function("replace", &PCRERegex::replace)
        .function("getPattern", &PCRERegex::getPattern)
        .function("getOptions", &PCRERegex::getOptions)
        ;
    
    // Utility functions
    function("quickTest", &quickTest);
    function("quickMatch", &quickMatch);
    function("getVersion", &PCREUtils::getVersion);
    function("getVersionString", &PCREUtils::getVersionString);
    function("getConfigInfo", &PCREUtils::getConfigInfo);
}
