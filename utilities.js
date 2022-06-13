"use strict";
const file = require('./File');

function addLeadingZeros(number, totalLength) {
    if(typeof number !== "number") return NaN;

    const sign = Math.sign(number);
    let res = Math.abs(number).toString();
    const toAdd = totalLength - res.length;

    if(0 < toAdd) {
        for (let i = 0; i < toAdd; i++) {
            res = "0" + res;
        }
    }

    if(sign < 0) {
        return "-" + res;
    }
    return res;
}

function timeToSeconds(time){
    time = time.split(':');
    if(time.length == 2){
        var minutesToSeconds = Math.floor(time[0] * 60);
        return (minutesToSeconds + parseInt(time[1]));
    } else if(time.length == 3){
        var hoursToSeconds = Math.floor(time[0] * 60 * 60);
        var minutesToSeconds = Math.floor(time[1] * 60);
    return (hoursToSeconds + minutesToSeconds + parseInt(time[2]));
    }
}

function CountDecimalDigits(number){
    var char_array = number.toString().split(""); // split every single char
    var not_decimal = char_array.lastIndexOf(".");
    return (not_decimal<0)?0:char_array.length - not_decimal;
}
function addTime(e, i){
    const eSeconds=  timeToSeconds(e);
    const iSeconds =  timeToSeconds(i)
    var totalSeconds =  eSeconds + iSeconds;
    let hours = Math.floor(totalSeconds / 3600);
    if(CountDecimalDigits(hours) <=1)hours = addLeadingZeros(hours,2)
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    if(CountDecimalDigits(minutes) <=1)minutes = addLeadingZeros(minutes,2)
    let seconds = totalSeconds % 60;
    if(CountDecimalDigits(seconds) <=1)seconds = addLeadingZeros(seconds,2)
    return  hours+':'+minutes+':'+seconds
}


async function guildPrefix(message) {
    let prefix = ''
    if(file.exists(`./guildData/${message.guild.id}/prefix.xd`)){
        prefix = await file.read(`./guildData/${message.guild.id}/prefix.xd`)
        console.log(prefix)
    }
    return prefix;
}



module.exports = {addLeadingZeros,timeToSeconds,addTime,guildPrefix};