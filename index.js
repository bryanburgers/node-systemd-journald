"use strict";

var journal = require( './build/Release/journal_send.node' );

function log( priority, message, fields ) {

	// If we haven't got a message, throw an error
	if( message === undefined ) {
		throw new Error( "Please specify a message" );
	}

	// Make sure fields is an object
	if( typeof fields != 'object' ) {
		fields = {};
	}

	// If the message is an instnce of Error, extract its message
	if( message instanceof Error ) {
		fields.STACK_TRACE = message.stack;
		message = message.message;
	} else if( typeof message != 'string' ) {
		message = message.toString();
	}

	var iovec = [];

	// Add default fields
	iovec.push( "PRIORITY=" + priority );
	iovec.push( "MESSAGE=" + message );

	// Add additional fields
	for( var f in fields ) {
		iovec.push( f + '=' + fields[f].toString() );
	}

	// Send it to out beloved journald

	journal.send.apply( null, iovec );

}


module.exports = {};

// Syslog log levels
var levels = [
	'emerg',
	'alert',
	'crit',
	'err',
	'warning',
	'notice',
	'info',
	'debug'
];

// Export a function for every log level
for( var l in levels ) { ( function( prio, name ) {

	module.exports[ name ] = function( message, fields ) {
		log( prio, message, fields );
	};

} )( l, levels[ l ] ); }