function TimeFormatter() {}
TimeFormatter.format = function (milliseconds, format) {
    if (milliseconds === null || format === null) { return ''; }
	
	var negative = milliseconds<0;
	if (negative) {
		milliseconds *= -1;
	}

    // TODO Remove duplicate results.
    var directives = format.match(/([%]{1,2}[DHMSfh]{1})/g);
    var i;
    if (directives !== null) {
        for (i = 0; i < directives.length; i++) {
            format = TimeFormatter.replace(milliseconds, directives[i], format);
        }
    }
	
    return (negative ? '-' : '') + format;
};
TimeFormatter.replace = function (milliseconds, directive, s) {
    var value = '';
    switch (directive) {
        case '%%D':
            value = TimeFormatter.zero(Math.floor(milliseconds / 86400000), 2);
            break;
        case '%H':
            value = TimeFormatter.zero(Math.floor(milliseconds / 3600000) % 24, 2);
            break;
        case '%%H':
            value = TimeFormatter.zero(Math.floor(milliseconds / 3600000), 2);
            break;
        case '%M':
            value = TimeFormatter.zero(Math.floor(milliseconds / 60000) % 60, 2);
            break;
        case '%%M':
            value = TimeFormatter.zero(Math.floor(milliseconds / 60000), 2);
            break;
        case '%S':
            value = TimeFormatter.zero(Math.floor(milliseconds / 1000) % 60, 2);
            break;
        case '%%S':
            value = TimeFormatter.zero(Math.floor(milliseconds / 1000), 2);
            break;
        case '%f':
            value = TimeFormatter.zero(milliseconds % 1000, 3);
            break;
        case '%%f':
            value = TimeFormatter.zero(milliseconds, 3);
            break;
        case '%h':
            value = String(TimeFormatter.zero(milliseconds % 1000, 3)).substring(0, 2);
            break;
    }
    return s.replace(directive, value);
};
TimeFormatter.zero = function (s, length) {
    var d = length > s.toString().length ? length - s.toString().length : 0;
    for (var i = 0; i < d; i++) {
        s = '0' + s;
    }
    return s;
};
