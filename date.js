
// console.log(module);

exports.getDate = function() {
    var today = new Date();
    var day = "";
    
    // days = {
    //     0: "Sunday",
    //     1: "Monday",
    //     2: "Tuesday",
    //     3: "Wednesday",
    //     4: "Thursday",
    //     5: "Friday",
    //     6: "Saturday"
    // }


    options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    };

    day = today.toLocaleDateString("en-US", options);
    // day = days[today.getDay()];

    return day;
}

exports.getDay = function() {
    var today = new Date();    
    options = {
        weekday: "long",
    };

    let day = today.toLocaleDateString("en-US", options);

    return day;
}
 
console.log(module.exports);
 