"use strict";

var vercheck = require('./check_packages_version');
var chalk = require('chalk');
var Table = require('cli-table');

var borderless_config = { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
 	'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
 	'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': '',
 	'right': '' , 'right-mid': '' , 'middle': ' ' };
var local_head = [
	chalk.magenta.bold('Package name'), 
	chalk.magenta.bold('Installed'), 
	chalk.magenta.bold('Available'), 
	chalk.magenta.bold('Latest')
	];
var local_dependancy_table = new Table({
	chars: borderless_config,
    head: local_head,
    colWidths: [30, 13, 13, 13]
});
var global_head = [
	chalk.magenta.bold('Package name'), 
	chalk.magenta.bold('Installed'), 
	chalk.magenta.bold('Latest')
	];
var global_dependancy_table = new Table({
	chars: borderless_config,
    head: global_head,
    colWidths: [30, 13, 13]
});

function local_format_report(package_info, key)
{
	var name = chalk.blue.bold(package_info.name);
	var installed = package_info.installed;
	var available = package_info.available;
	var latest = package_info.latest;

	if (latest.localeCompare(available) === 0) {
		if (available.localeCompare(installed) === 0) {
			installed = chalk.green.bold(installed);
		}else {
			installed = chalk.red.bold(installed);
		}
		available = chalk.green.bold(available);
	} 
	else {
		available = chalk.red.bold(available);
		installed = chalk.red.bold(installed);
	}
	latest = chalk.green.bold(latest);

	if (key === 'dev') {
		name = name + chalk.yellow.bold("(dev)");
	}
	return [name, installed, available, latest];
}

function global_format_report(package_info)
{
	var name = chalk.blue.bold(package_info.name);
	var installed = package_info.installed;
	var latest = package_info.latest;

	if (installed.localeCompare(latest) === 0) {
		installed = chalk.green.bold(installed);
	}else {
		installed = chalk.red.bold(installed);
	}
	latest = chalk.green.bold(latest);
	return [name, installed, latest];
}

function process_default()
{
	vercheck.check_local_version().then(function(report){
		for (var key in report)
		{
			var packages = report[key].fulfilled;
			for (var i = 0; i < packages.length; i++) {
		    	local_dependancy_table.push(local_format_report(packages[i], key));
		    }
		}
	    console.log(local_dependancy_table.toString());
	});
}

function process_global()
{
	vercheck.check_global_version().then(function(report){
	    var packages = report.pro.fulfilled;
	    for (var i = 0; i < packages.length; i++) {
	    	global_dependancy_table.push(global_format_report(packages[i]));
	    }
	    console.log(global_dependancy_table.toString());
	});
}

process_default();
process_global();
module.exports = process_default;