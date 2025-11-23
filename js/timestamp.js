(function(window) {
    function TimeStamp() {
        var library = {};

        // Converts 24-hour time to AM/PM format
        library.getAMPM = function(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        };

        // Retrieve month from timestamp
        library.getMonth = function(timestamp) {
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return months[timestamp.getMonth()];
        };

        // Retrieve weekday from timestamp
        library.getWeekDay = function(timestamp) {
            var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return days[timestamp.getDay()];
        };

        // Check if two dates are the same day
        library.isSameDay = function(date1, date2) {
            return date1.getFullYear() === date2.getFullYear() &&
                   date1.getMonth() === date2.getMonth() &&
                   date1.getDate() === date2.getDate();
        };

        // Check if a date is yesterday relative to current
        library.isYesterday = function(date, current) {
            const yesterday = new Date(current);
            yesterday.setDate(current.getDate() - 1);
            return library.isSameDay(date, yesterday);
        };

        // Check if two dates are in the same year
        library.isSameYear = function(date1, date2) {
            return date1.getFullYear() === date2.getFullYear();
        };

        // Check if a date is within the last 7 days
        library.isWithinWeek = function(date, current) {
            const diffTime = current - date;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            return diffDays <= 7 && diffDays >= 0;
        };

        // Beautifies timestamp: e.g., "January 1, 1999", "Monday at 12:00 AM", "Today at 12:00 AM"
        library.Beautify = function(timestamp) {
            const date = new Date(timestamp);
            if (isNaN(date)) return "Invalid Date";

            const currentDate = new Date();

            if (!library.isSameYear(date, currentDate)) {
                return `${library.getMonth(date)} ${date.getDate()}, ${date.getFullYear()}`; // January 1, 1999
            } else if (!library.isWithinWeek(date, currentDate)) {
                return `${library.getMonth(date)} ${date.getDate()}`; // January 1
            } else if (library.isYesterday(date, currentDate)) {
                return `Yesterday at ${library.getAMPM(date)}`; // Yesterday at 12:00 AM
            } else if (library.isSameDay(date, currentDate)) {
                return `${library.getAMPM(date)}`; // 12:00 AM
            } else {
                return `${library.getWeekDay(date)} at ${library.getAMPM(date)}`; // Monday at 12:00 AM
            }
        };

        // Shortens timestamp: e.g., "Jan 1, 1999", "Jan 1", "Mon", "12:00 AM"
        library.Shorten = function(timestamp) {
            const date = new Date(timestamp);
            if (isNaN(date)) return "Invalid Date";

            const currentDate = new Date();

            if (!library.isSameYear(date, currentDate)) {
                return `${library.getMonth(date).substr(0, 3)} ${date.getDate()}, ${date.getFullYear()}`; // Jan 1, 1999
            } else if (!library.isWithinWeek(date, currentDate)) {
                return `${library.getMonth(date).substr(0, 3)} ${date.getDate()}`; // Jan 1
            } else if (!library.isSameDay(date, currentDate)) {
                return `${library.getWeekDay(date).substr(0, 3)}`; // Mon
            } else {
                return library.getAMPM(date); // 12:00 AM
            }
        };

        return library;
    }

    if (typeof window.TimeStamp === 'undefined') {
        window.TimeStamp = TimeStamp();
    }
})(window);