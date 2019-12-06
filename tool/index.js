module.exports = {
    convertUrlToID: function(string) {
    	let result;
		const regex_1 = /fbid=(.*?)&set+/;
		const regex_2 = /videos\/(.*?)\//;
		const regex_3 = /photos\/a.(.*?)\//;
		const regex_4 = /permalink\/(.*?)\//;
		const regex_5 = /permalink\.php\?story_fbid=(.*?)&id/;
		const regex_6 = /posts\/(.*)/;
		const regex_7 = /posts\/(.*?)\?__xts__/;
		const regex_8 = /[0-9]{10,30}/;
		let matching  =  string.match(regex_1) ||  string.match(regex_2) || string.match(regex_3) || string.match(regex_4) || string.match(regex_5) || string.match(regex_7)  || string.match(regex_6) ;
		let matchID  = string.match(regex_8);
		if ( matching ) {
			matching.forEach((match, groupIndex) => {
			    if(groupIndex > 0) {
			    	result = match;
		     	}	     
			});
		}
		if (matchID) {
			matchID.forEach((match, groupIndex) => {
			    	result = match;     
			});
		}

		return result
    }
}