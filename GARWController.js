/*
Author: dustinsterk
GARW Lotus Dash Controller (since iOS and Android apps no longer exist in store)
PREREQ/Dependency:  You must install Node on your machine as this is a NodeJS script

Once installed launch from a cmd/terminal window with:  node GARWController.js
Use the arrow keys Up, Down, Left, and Right to control the screen (press Up on a screen to edit values)
Use the s key to enter GARW settings (which you can edit odometer, and other major changes)
Use Ctrl + C to Quit.
Enjoy!
*/

var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

var host = "192.168.42.1"; //GARW IP
var port = 1234; //GARW Listening Port
var dgram = require("dgram");
var client = dgram.createSocket("udp4");
var settings = 0;

//This interval is needed to keep a heartbeat and allow for key pressess in rapid succession
setInterval(() => {
    var message = new Buffer.from("0100", "hex");
    if (settings == 0) {
        client.send(message, 0, message.length, port, host);
    }
}, 200);

process.stdout.write('***** Use arrow keys to navigate *****'+ '\n'); 
process.stdout.write('***** Use the s key for GARW settings *****'+ '\n'); 
process.stdout.write('***** Use crtl-c to quit *****'+ '\n'); 

stdin.on('data', function(key){
    if (key == '\u001B\u005B\u0041') {
        var message = new Buffer.from("0101", "hex");
        client.send(message, 0, message.length, port, host);
        process.stdout.write('up'+ '\n'); 
    }
    if (key == '\u001B\u005B\u0043') {
        var message = new Buffer.from("0108", "hex");
        client.send(message, 0, message.length, port, host);
        process.stdout.write('right'+ '\n'); 
    }
    if (key == '\u001B\u005B\u0042') {
        var message = new Buffer.from("0102", "hex");
        client.send(message, 0, message.length, port, host);
        process.stdout.write('down'+ '\n'); 
    }
    if (key == '\u001B\u005B\u0044') {
        var message = new Buffer.from("0104", "hex");
        client.send(message, 0, message.length, port, host);
        process.stdout.write('left'+ '\n'); 
    }
    if (key == 's') { //Enters settings by pressing left then no hearbeat for 5 seconds, press s again to exit
        var message = new Buffer.from("0104", "hex");
        settings = 1;
        client.send(message, 0, message.length, port, host);
        process.stdout.write('settings'+ '\n'); 
        setTimeout(function() {
            settings = 0;
            message = new Buffer.from("0108", "hex");
            client.send(message, 0, message.length, port, host);
        }, 5000);
    }

    if (key == '\u0003') { 
        client.close();
        process.exit(); 
    }    // ctrl-c
});