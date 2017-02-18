exports.run = (bot, message) => {
	let input = message.content.toLowerCase();
	if (!input.startsWith(bot.commandPrefix) && !input.length <= 2) return;
	let cmd = input.slice(1).split(' ')[0];

	if (cmd === 'nicememe') {
		message.channel.sendFile('http://i.imgur.com/vSFbKbF.gelse if');
	}	else if (cmd === 'eyes') {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/146477690885636096/176038770292817921/eyes.gif');
	}	else if (cmd.startsWith('attention')) {
		message.channel.sendFile('https://i.gyazo.com/916d0d61d3a43c287cea92025a16311a.png');
	}	else if (cmd.startsWith('dense')) {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/116384336302964742/171428487125532673/IMG_2213.JPG');
	}	else if (cmd.startsWith('dip')) {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/116578843237548033/191022696954462209/giphy.gif');
	}	else if (cmd.startsWith('hollywood')) {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/116578843237548033/191022579321012235/1457241581864.jpg');
	}	else if (cmd.startsWith('welp')) {
		message.channel.sendFile('https://s-media-cache-ak0.pinimg.com/736x/a1/02/65/a10265b34601e8eaf774656c6ec4e855.jpg');
	}	else if (cmd === 'sexybowser') {
		message.channel.sendFile('http://imgur.com/DE95SU0.png');
	}	else if (cmd === 'fu') {
		let items = ['https://abload.de/img/auraflipxojkp.png', 'https://cdn.discordapp.com/attachments/174674066072928256/188402140002123787/unknown.png'];
		message.channel.sendFile(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'fthis') {
		message.channel.sendFile('http://67.media.tumblr.com/3111b46d9d21d12c94223596ed9247ff/tumblr_oebv6yNptr1vc1lqxo3_250.gif');
	}	else if (cmd === 'chew') {
		let items = ['https://cdn.discordapp.com/attachments/124680198149898242/198191643399028737/popcorn_3.gif'];
		message.channel.sendFile(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'shitpost') {
		message.channel.sendMessage('https://giant.gfycat.com/ImpoliteSinfulBuzzard.gelse if');
	}	else if (cmd.startsWith('anger')) {
		let items = ['http://i3.kym-cdn.com/photos/images/facebook/001/015/665/006.png', 'http://i.imgur.com/S56PYLr.jpg'];
		message.channel.sendFile(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'umad') {
		message.channel.sendFile('http://orig00.deviantart.net/fd54/f/2013/011/2/d/profile_picture_by_lucarioumadplz-d5r7ixt.png');
	}	else if (cmd === 'ez$') {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/174255201669087233/199413348842995713/maxresdefault.png');
	}	else if (cmd.startsWith('hd')) {
		message.channel.sendFile('http://img2.wikia.nocookie.net/__cb20140818100403/madnesscombat/images/7/73/Headdesk.gif');
	}	else if (cmd.startsWith('flip')) {
		message.channel.sendFile('http://i.imgur.com/72ziBNk.gelse if');
	}	else if (cmd.startsWith('triggered')) {
		message.channel.sendFile('http://i.imgur.com/7WtEXRe.png');
	}	else if (cmd.startsWith('addup')) {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/116578843237548033/191023342298464268/eyJ1cmwiOiJodHRwczovL2Rpc2NvcmQuc3RvcmFnZS5nb29nbGVhcGlzLmNvbS9hdHRhY2htZW50cy84MzA5ODA1ODY4MTc0NTQwOC8xODgzMjc0MzA4NDU0OTczNDUvQ1p4UFE3YldFQUVGRXFuLnBuZyJ9.9sD6HCtonXy075mnQpW-NMHO650.png');
	}	else if (cmd === 'sol') {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/117654775511777285/196077299387465729/unknown.png');
	}	else if (cmd === 'lewdmemes') {
		let shit = 'https://cdn.discordapp.com/attachments/147355328852262912/169638582154166274/unknown.png;https://cdn.discordapp.com/attachments/147355328852262912/169638633903489025/unknown.png;https://cdn.discordapp.com/attachments/168529548625838091/169786680197251073/Screen_Shot_2016-04-13_at_8.31.10_AM.png;http://prntscr.com/au0kdf;http://prntscr.com/au0asy;http://prntscr.com/av84j9;https://cdn.discordapp.com/attachments/147355328852262912/170301845506490369/unknown.png;https://cdn.discordapp.com/attachments/147355328852262912/169638411517427713/unknown.png;https://cdn.discordapp.com/attachments/146391778566602752/172931331989307393/Screen_Shot_2016-04-22_at_12.49.50_AM.png;https://cdn.discordapp.com/attachments/147355328852262912/170295971035611137/unknown.png;http://prntscr.com/atx35m;https://cdn.discordapp.com/attachments/147355328852262912/170072655070887936/unknown.png;http://prntscr.com/au1o48;https://cdn.discordapp.com/attachments/147355328852262912/169641054092394497/unknown.png;https://cdn.discordapp.com/attachments/147355328852262912/169638527246532609/unknown.png;https://cdn.discordapp.com/attachments/147355328852262912/169643220173717505/unknown.png;https://cdn.discordapp.com/attachments/147355328852262912/170303200560152577/unknown.png;https://cdn.discordapp.com/attachments/147355328852262912/169961995444027393/unknown.png;https://cdn.discordapp.com/attachments/147355328852262912/169638039029547011/unknown.png;https://cdn.discordapp.com/attachments/147355328852262912/169961945019973633/unknown.png;https://cdn.discordapp.com/attachments/147355328852262912/170298264111808524/unknown.png;http://prntscr.com/axr5qv;http://prntscr.com/axr5sw;http://prntscr.com/axr5ua;http://prntscr.com/axr5w8;http://prntscr.com/axr5xy;http://prntscr.com/axr5za;http://prntscr.com/axr61h;http://prntscr.com/ay3n9l;http://prntscr.com/ay3nbc;http://prntscr.com/ay3y86;http://prntscr.com/ay5g2c;http://prntscr.com/ay5hu8;http://prntscr.com/ayji0j;http://prntscr.com/ayqoyj;http://prntscr.com/ayqrzn;http://prntscr.com/az2xrf;http://prntscr.com/azx56r;http://prntscr.com/b01lby;http://i.imgur.com/lDISBNg.png;http://i.imgur.com/oQ5atLS.png;http://prntscr.com/b0f5v1;http://prntscr.com/b0f73d;http://prntscr.com/b0gcg7;http://i.imgur.com/MvU4YbE.png;http://i.imgur.com/z6fAbYB.png;http://i.imgur.com/mHwuXpH.png;http://prntscr.com/b0qoqn;http://prntscr.com/b0sdzf;http://prntscr.com/b0se04;http://prntscr.com/b0uhv8;http://prntscr.com/b144bh;http://prntscr.com/b16a33;http://prntscr.com/b1r1pi;http://prntscr.com/b1rl6a;http://prntscr.com/b1t8d0;http://prntscr.com/b1utmz;http://prntscr.com/b1vg8x;http://prntscr.com/b1vluz;https://cdn.discordapp.com/attachments/147355328852262912/179049869724352513/unknown.png;http://prntscr.com/b1w2ce;https://cdn.discordapp.com/attachments/147355328852262912/179113054015979522/unknown.png;http://i.imgur.com/ba53ydE.png;http://prntscr.com/b26vdr;http://prntscr.com/b28kiu;http://prntscr.com/b28mt7;http://prntscr.com/b2mah2;http://prntscr.com/b2y055;http://prntscr.com/b1i5j9;http://prntscr.com/b5rhvt;http://i.imgur.com/nu49Yxy.png;http://prntscr.com/b6kw2z;http://prntscr.com/b6l1zk;http://prntscr.com/b6xbeu;http://i.imgur.com/n07dJBW.png;http://prntscr.com/bd9dnf;http://prntscr.com/bv1c9z;http://prntscr.com/btev9s;http://prntscr.com/bovt0n;http://prntscr.com/boi2h9;http://prntscr.com/boeph3;http://prntscr.com/bnld9u;http://prntscr.com/bmu3rc;http://prntscr.com/bmu3ez;http://prntscr.com/bmfscv;http://prntscr.com/bmf7cf;http://prntscr.com/bk3lc6;http://prntscr.com/bk33hh;http://prnt.sc/bv1fw5;http://prntscr.com/bgw1nj;http://prntscr.com/bv1g0b;http://prntscr.com/bg11h6;http://prntscr.com/bv1g5r;http://prntscr.com/bg1qn5;http://prntscr.com/bv1gbm;http://prntscr.com/bzbluh;http://imgur.com/d3xkwFz.png;http://imgur.com/HV6LyDV.png;http://imgur.com/knpEsns.png;http://imgur.com/whnkolq.png;http://imgur.com/aPJxOdW.png;http://imgur.com/pvfNnpk.png;http://imgur.com/0Ti6M3J.png;http://imgur.com/EQb12V6.png;http://imgur.com/itdgQAp.png;http://imgur.com/z0eYijT.png;http://imgur.com/bvYtomT.png;http://imgur.com/hCjRRjN.png;http://imgur.com/rMvPs18.png;http://imgur.com/T5nnLB4.png;http://imgur.com/eusaPuy.png;';
		shit = shit.split(';');
		message.channel.sendMessage(`${shit[Math.floor(Math.random() * shit.length)]}`);
	}	else if (cmd === 'learn') {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/168788080000499712/198879081704587265/dream.PNG');
	}	else if (cmd === 'vroom') {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/144552169398337536/198902886095126540/vroomvroom.jpg');
	}		else if (cmd === 'kami') {
		let items = ['http://imgur.com/mREblNB.png', 'http://imgur.com/goEzeIx.png', 'http://imgur.com/KH0YAbo.png', 'http://imgur.com/agrOXqg.png', 'http://imgur.com/U1Krp30.png', 'http://imgur.com/7YczH7k.png', 'http://imgur.com/MJyOdKe.png', 'http://imgur.com/ZK6Z2KF.png', 'http://imgur.com/0gWzlhA.png', 'http://imgur.com/XfPPcOi.png', 'http://prnt.sc/bv4y66'];
		message.channel.sendMessage(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'steam' || cmd === 'keti' || cmd === 'stem') {
		message.channel.sendMessage('http://prntscr.com/buz1mq');
	}	else if (cmd === 'awoo') {
		message.channel.sendFile('http://i0.kym-cdn.com/photos/images/newsfeed/000/910/542/1e8.jpg');
	}	else if (cmd === 'a2e') {
		let items = ['http://prntscr.com/bvcl50', 'http://prntscr.com/bvcli1', 'http://prntscr.com/bvclp2', 'http://prntscr.com/bvclro', 'http://prntscr.com/bvcltx', 'http://prntscr.com/bvclwc', 'http://prntscr.com/bvcm0c', 'http://prntscr.com/bvcm3b', 'http://prntscr.com/bvcm5u', 'http://prntscr.com/bvcm88', 'http://prntscr.com/bvcmb5', 'http://prntscr.com/bvcnw4', 'http://prntscr.com/bvcqcc', 'http://prntscr.com/bvctcb', 'http://prntscr.com/bvcxgs'];
		message.channel.sendMessage(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'zelda') {
		let items = ['http://i.imgur.com/LD4Q0j8.png', 'http://i.imgur.com/aPrvF0b.jpg', 'http://puu.sh/q3LEM/269933d3fc.jpg', 'http://i.imgur.com/IyaSr6h.jpg', 'http://i.imgur.com/zCs570o.jpg'];
		message.channel.sendMessage(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'timmysux') {
		message.channel.sendMessage('http://oddshot.tv/shot/mcdareth-2016030521458263');
	}	else if (cmd === 'aura') {
		let items = ['https://gfycat.com/UltimatePreciousBlackbird', 'http://oddshot.tv/shot/smashunited-201603140911703', 'https://gfycat.com/FlamboyantShoddyBushsqueaker', 'http://imgur.com/plefy7Z.png'];
		message.channel.sendMessage(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'coding') {
		message.channel.sendMessage('<http://www.stilldrinking.org/programming-sucks>');
	}	else if (cmd === 'luma') {
		let items = ['https://gfycat.com/PeacefulRealEgg', 'http://oddshot.tv/shot/showdowngg-2016011753143824', 'http://oddshot.tv/shot/showdowngg-2016011613218276', 'http://i.imgur.com/NtohbyB.gifv', 'http://i.imgur.com/r6wTqQS.gif', 'http://m.imgur.com/6Uq556t?r', 'https://youtu.be/F3XN3m-6q7w', 'http://m.imgur.com/G1YljDl.gif', 'http://i.imgur.com/qdpOywW.gifv', 'https://www.youtube.com/watch?v=ArXIuKNBdW4', 'https://twitter.com/LettuceUdon/status/741881064130367488', 'http://i.imgur.com/Zqiy6u9.gif', 'https://images-2.discordapp.net/.eJwFwdsRhCAMAMBeKIAAGh62YQUcMtHxEQbi1831frtf9fZLLWoXaWMB2I5RuG96CPdMVRMzXTW3Y-jCN2SRXPa7PjIgJuOTsc5g9OiDj2ATIrppdtZ4DCbgDJ0-E52rbg-p3x_j6yI0.Pgjy7k_cFbM9aFiepZGuXfQ13Fw.png', 'https://twitter.com/DabuzSenpai/status/746102034793963524', 'https://oddshot.tv/shot/MVG_League/UzrqS3q_qS1P34GJkhfWT-Of', 'https://gfycat.com/RealYellowBuckeyebutterfly', 'https://i.gyazo.com/e0af536fb2a9796b930ea5155a337453.gif', 'http://i.imgur.com/Jcxt4Yd.gifv', 'http://i.imgur.com/UrEcikV.gifv', 'http://i.imgur.com/aWPl6hS.gifv', 'https://gfycat.com/FewHappyAmericanalligator'];
		message.channel.sendMessage(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'yee') {
		message.channel.sendFile('http://i.imgur.com/RNOVPGx.gelse if');
	}	else if (cmd === 'cs') {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/144552169398337536/200542362617905154/IMG_3479.JPG');
	}	else if (cmd === 'fudge') {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/174674066072928256/197579295638421515/1460351804681.jpg');
	}	else if (cmd === 'lewd') {
		let items = ['https://lh4.googleusercontent.com/VrNeB07Ikl-fS1M4178itOHzI2uSD2jZlmSs436jBLuoSOgKGj1MinQ9pDeMWVgLm5F9GA=w1879-h835', 'https://lh4.googleusercontent.com/0nKLIUkqwbW3SdOFrKkeAgHDkgaGxeYE6p9Na8W8xmQ9GCk-zdRlcKtsNB9uNRvGn-1i_w=w1879-h835', 'https://lh6.googleusercontent.com/KxS4HY0h8XOOyQmnoHk7ds1KGkXFoOihm3K92Ijd9tVGmsNPcP-qGGt_sR0ceM6d_46jow=w1879-h835', 'https://lh4.googleusercontent.com/Xn4GHFgSIS8I00Zr678a_ogMxrhB5GH8cIA15KB0jzG2kbQwKgwh-UJkwpZlR60yFlBMGg=w1879-h835', 'http://i2.kym-cdn.com/photos/images/original/000/888/789/f39.jpg', 'http://i1.kym-cdn.com/photos/images/newsfeed/001/030/317/a0f.gif', 'https://d.gr-assets.com/hostedimages/1417619492ra/12444030.gif', 'http://i.imgur.com/vZnMTFn.gif', 'http://i0.kym-cdn.com/photos/images/original/001/003/049/c7c.gif', 'http://i.imgur.com/1S78oau.png', 'http://i0.kym-cdn.com/photos/images/facebook/000/786/305/7db.gif', 'http://i2.kym-cdn.com/photos/images/original/000/746/820/fed.gif'];
		message.channel.sendMessage(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'wtf') {
		message.channel.sendFile('https://media.giphy.com/media/cKiclfE45nViE/giphy.gif');
	}	else if (cmd === 'concern') {
		let items = ['https://s-media-cache-ak0.pinimg.com/736x/09/5c/94/095c94aee0d62fca5a985e9094029f59.jpg', 'https://cdn.discordapp.com/attachments/184173443711762433/191648449756659713/Lz9PrEn.png'];
		message.channel.sendFile(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'uwu') {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/121504267482693632/191721851829878785/Cjw0fsGUYAAuA9q.jpg');
	}	else if (cmd === 'zero') {
		let items = ['http://imgur.com/2GQmIPQ.png', 'http://imgur.com/wBtX0ms.png', 'http://i.imgur.com/QOrX8JK.png', 'http://i.imgur.com/bjVjnPk.png', 'http://i.imgur.com/YJW4bzj.png', 'http://i.imgur.com/YJW4bzj.png', 'https://cdn.discordapp.com/attachments/147355328852262912/170008303403925505/unknown.png', 'http://prntscr.com/as1vqg'];
		message.chnnel.sendFile(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === '?') {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/116384336302964742/179350740765114370/confused_meme.png');
	}	else if (cmd === 'cracks') {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/89069012058656768/167395112693923843/raw.gif');
	}	else if (cmd === 'freedom') {
		let items = ['http://www.relatably.com/m/img/us-freedom-memes/2135440.jpg', 'http://img.memecdn.com/freedom_c_1234839.jpg', 'http://www.relatably.com/m/img/us-freedom-memes/3903874.jpg', 'http://img.memecdn.com/freedom-eagle-forever_o_630645.jpg', 'http://www.funniestmemes.com/wp-content/uploads/2014/03/Funniest_Memes_freedom-now-say-it-bitch_1478.jpeg', 'http://www.kappit.com/img/pics/201602_1005_eiibd_sm.jpg', 'http://memes.doublie.com/wp-content/uploads/2015/07/011.jpg', 'http://i.imgur.com/gChvq2X.jpg?1', 'https://whitedevilblog.files.wordpress.com/2014/01/freedommotherfucker.jpg', 'http://imgur.com/BbbKtB7.png', 'https://www.youtube.com/watch?v=IhnUgAaea4M', 'http://imgur.com/sWE0fjP.png', 'http://imgur.com/g6tUDLs.png'];
		message.channel.sendMessage(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'critmemes') {
		let items = ['http://i.imgur.com/8LQwsUX.png', 'http://i.imgur.com/C2c1UWO.png', 'http://i.imgur.com/QWg5nML.png', 'http://i.imgur.com/Zw3OsyR.png', 'http://imgur.com/2OjlhRa.png', 'http://imgur.com/rYgXyV5.png', 'http://imgur.com/mL0uDCZ.png', 'http://imgur.com/WDGmnQA.png', 'http://imgur.com/QffEMXZ.png', 'http://imgur.com/woRaLMe.png', 'http://imgur.com/5VQnI7D.png', 'http://imgur.com/uOSUVN6.png', 'http://imgur.com/4zBTCSA.png', 'http://imgur.com/8l6B4W7.png', 'http://imgur.com/zbL7Xwx.png', 'http://imgur.com/ZTkGFUO.png', 'http://imgur.com/N8jcaEw.png'];
		message.channel.sendFile(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'nomemes') {
		message.channel.sendFile('https://cdn.meme.am/instances/500x/68818309.jpg');
	}	else if (cmd === 'ggez') {
		message.channel.sendFile('https://i.ytimg.com/vi/7Tyb50tSoNg/maxresdefault.jpg');
	}	else if (cmd === 'mang0') {
		message.channel.sendFile('http://imgur.com/h04DZtR.png');
	}	else if (cmd === 'nope') {
		let items = ['http://i.imgur.com/oBOWnWl.gif', 'https://gfycat.com/TallSnoopyDromaeosaur', 'https://gfycat.com/SelfreliantDecentFinwhale'];
		message.channel.sendMessage(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'hue') {
		let items = ['https://cdn.discordapp.com/attachments/116384336302964742/189869182030970881/1344334373772.png', 'https://cdn.discordapp.com/attachments/116384336302964742/189872746560225281/1445092608980.jpg', 'https://cdn.discordapp.com/attachments/116384336302964742/189876872677425153/0IYzpNm.jpg'];
		message.channel.sendFile(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'slide') {
		message.channel.sendFile('https://cdn.discordapp.com/attachments/124680198149898242/199288443929493505/SLIDING_INTO_YOUR_DMS_LIKE.PNG');
	}	else if (cmd === 'blur') {
		let items = ['http://imgur.com/MBeagVJ.png', 'http://imgur.com/VrKn4ED.png', 'http://imgur.com/6c1L2G7.png', 'http://imgur.com/ImyvZS2.png', 'http://imgur.com/OsIPSII.png', 'http://imgur.com/DMBEDq5.png', 'http://imgur.com/44ts5oC.png'];
		message.channel.sendMessage(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'cubone') {
		let items = ['http://i.imgur.com/TkyrRd0.png', 'http://i.imgur.com/qkj8bhs.jpg', 'http://i.imgur.com/tYIBw4L.gifv', 'http://i.imgur.com/ipAkVbm.gifv', 'http://i.imgur.com/4RvTLjZ.gifv', 'http://i.imgur.com/HZQhw1q.gifv', 'http://i.imgur.com/I1kj114.gifv', 'http://i.imgur.com/ek3fzvn.gifv', 'http://i.imgur.com/zcybazG.gifv', 'http://i.imgur.com/x1O72ML.jpg', 'http://i.imgur.com/JVNwWqN.jpg', 'http://i.imgur.com/vWW6FP4.png', 'http://i.imgur.com/rscbdae.gifv', 'http://i.imgur.com/JspXNk6.gifv', 'http://i.imgur.com/TuGCzz4.gifv', 'http://i.imgur.com/a5uoyrG.gifv', 'http://i.imgur.com/xp20vTR.png', 'http://i.imgur.com/Shh35yg.jpg', 'http://i.imgur.com/QDHuREs.png', 'http://i.imgur.com/IK04L1c.gifv', 'http://i.imgur.com/qBrCOx4.png', 'http://i.imgur.com/zotN37K.gifv', 'http://i.imgur.com/lOWqC4p.gifv', 'http://i.imgur.com/F3M16p7.gifv', 'http://i.imgur.com/UlgWDfW.gifv', 'http://i.imgur.com/BSuGTRn.png', 'http://i.imgur.com/vcNRk9i.gifv', 'http://i.imgur.com/eAhKfOh.gifv'];
		message.channel.sendMessage(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'epic') {
		let items = ['http://imgur.com/5wtRbzm.png', 'http://imgur.com/clEvBDU.png'];
		message.channel.sendFile(`${items[Math.floor(Math.random() * items.length)]}`);
	}	else if (cmd === 'shitpost') {
		message.channel.sendFile('https://gfycat.com/ImpoliteSinfulBuzzard');
	}	else if (cmd === 'fudgepls') {
		let items = ['http://i.imgur.com/Dzluogq.png', 'http://i.imgur.com/zuXvbu5.png', 'http://i.imgur.com/KDEnkCh.png', 'http://i.imgur.com/BzXCPaU.jpg', 'http://i.imgur.com/a1E0Tu5.jpg', 'http://i.imgur.com/FdyrAgg.png', 'http://i.imgur.com/Ret960f.png', 'http://i.imgur.com/LaUcgQ6.png', 'http://i.imgur.com/98UqLzH.png', 'http://i.imgur.com/op0WrYE.jpg', 'http://i.imgur.com/zmbfitO.png', 'http://i.imgur.com/WQplDSf.jpg', "fabulous ain't it \n http://i.imgur.com/s2L5bWX.jpg", 'http://i.imgur.com/8SXQVMo.jpg', 'http://i.imgur.com/8xizNVr.png', 'http://i.imgur.com/8xizNVr.png', 'http://i.imgur.com/KJqdnKG.jpg', 'http://i.imgur.com/d7hGDcv.png'];
		message.channel.sendMessage(`${items[Math.floor(Math.random() * items.length)]}`);
	} else if (cmd === 'rekt') {
		message.channel.sendFile('http://i.imgur.com/tc5RhwT.gifv');
	} else {
		const customcommands = bot.provider.get(message.guild, 'customcommands', {});
		if (!customcommands) return;
		let exists = true;
		Object.keys(customcommands).forEach((name) => {
			if (name === cmd || `,${cmd}` === name) {
				if (customcommands[name].response.constructor === Array) {
					var output = '';
					var response = customcommands[name].response;
					for (var i = 0; i < response.length; i++) {
						if (i % 2 === 0) {
							output += response[i];
						} else if (i % 2 === 1) {
							let outcomes = response[i].split(';');
							output += outcomes[Math.floor(Math.random() * outcomes.length)].trim();
						}
					}
					message.channel.sendMessage(output);
				}	else { message.channel.sendMessage(customcommands[name].response); }
				exists = true;
			}
		});
		// if (!exists) message.channel.sendMessage(`Command \`${cmd}\` not found.`);
	}
};
