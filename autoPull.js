/* 
 * 每隔一分钟运行一下pull 
 */ 
var exec = require('child_process').exec;
var countDown = 60;
var timer = null;
var totalCount = 0;

function gitpull() {
    doExec( "git pull" , function( stdout ){
        console.log( "\ngit pull 👇\n", stdout );
        totalCount ++
        readyToGo();
    })
}

function doExec( command , callback ) {
    exec( command , { encoding:'utf8'}, function( err , stdout , stder ){
        // 如果出错
        if(err) {
            console.log('exec err:'+stder);
        } else {
            callback && callback( stdout )
        }
    }) 
}

function readyToGo () {
	countDown = 60
	timer = setInterval( function(){
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write(
			`👍 ${totalCount} . Next git pull: ${countDown} s`
		);
		// console.log("Next git pull: "+countDown+" s")
		countDown --
		if ( countDown <=0 ){
			clearInterval( timer )
			gitpull()
		}
	}, 1000)
}

readyToGo();