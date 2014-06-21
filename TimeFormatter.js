function TimeFormatter() {}
TimeFormatter.format = function(milliseconds, format) {
    if (milliseconds == null || format == null) { return ''; }
	
	var negative = milliseconds<0;
	if(negative) {
		milliseconds*=-1;
	}

    // TODO Remove duplicate results.
    var directives = format.match(/([%]{1,2}[DHMSfh]{1})/g);
    if (directives != null) {
        for (var i = 0; i < directives.length; i++) {
            format = TimeFormatter.replace(milliseconds, directives[i], format);
        }
    }
	
    return (negative? "-":"") + format;
};
TimeFormatter.replace = function(milliseconds, directive, s) {
    switch (directive) {
        case '%%D':
            return s.replace(directive, TimeFormatter.zero(Math.floor(milliseconds / 86400000), 2));
        case '%H':
            return s.replace(directive, TimeFormatter.zero(Math.floor(milliseconds / 3600000) % 24, 2));
        case '%%H':
            return s.replace(directive, TimeFormatter.zero(Math.floor(milliseconds / 3600000), 2));
        case '%M':
            return s.replace(directive, TimeFormatter.zero(Math.floor(milliseconds / 60000) % 60, 2));
        case '%%M':
            return s.replace(directive, TimeFormatter.zero(Math.floor(milliseconds / 60000), 2));
        case '%S':
            return s.replace(directive, TimeFormatter.zero(Math.floor(milliseconds / 1000) % 60, 2));
        case '%%S':
            return s.replace(directive, TimeFormatter.zero(Math.floor(milliseconds / 1000), 2));
        case '%f':
            return s.replace(directive, TimeFormatter.zero(milliseconds % 1000, 3));
        case '%%f':
            return s.replace(directive, TimeFormatter.zero(milliseconds, 3));
        case '%h':
            return s.replace(directive, String(TimeFormatter.zero(milliseconds % 1000, 3)));
    }
};
TimeFormatter.zero = function(s, length) {
    var d = length > s.toString().length ? length - s.toString().length : 0;
    for (var i = 0; i < d; i++) {
        s = '0' + s;
    }
    return s;
};
