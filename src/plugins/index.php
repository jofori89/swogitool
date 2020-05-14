<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-us" lang="en-us" dir="ltr" class="gecko win">
<head>
    <link href="https://plus.google.com/113604133062343040318" rel="publisher" />
	<meta http-equiv="content-type"  content="text/html; charset=utf-8">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    <meta name="description" content="Sword Girls Anime magic card game. This is a portal library of all cards in game, contains updated list in Korean." />
	<meta name="keywords" content="Anime,web game,magic card,fan page" />	
	<meta name="title" content="Sword Girls Fanpage for Korean server" />
	<meta name="geo.region" content="KR-11" />
	<meta name="geo.placename" content="Seoul" />
	<meta name="geo.position" content="37.56165;126.982103" />
	<meta name="ICBM" content="37.56165, 126.982103" />

    <title>Sword Girls Deck Builder Version 2</title>
    <link href="style.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript">
        window.___gcfg = { lang: 'en' };
        (function () {
            var po = document.createElement("script");
            po.type = "text/javascript"; po.async = true; po.src = "https://apis.google.com/js/plusone.js";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(po, s);
        })();</script>
    <script type="text/javascript">

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-29273344-1']);
        _gaq.push(['_setDomainName', 'swogitools-v2.net63.net']);
        _gaq.push(['_trackPageview']);

        (function () {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
	</script>    
    <script type="text/javascript">
        // only used for standalone version
        var Loader = { datastream: null, cards: [] };
	</script>
	<script src="SwordGirlData.js" type="text/javascript"></script>	
    <!--	
	<script>
		var test = Loader.cards[0];
		if(Loader.cards[0] == undefined)
		{
			alert('Could not load offline database');
		}
	</script>
	<script src="http://www.swogitools.freevnn.com/SwordGirlData.js" type="text/javascript"></script>
	 -->
    <!-- jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
    <link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/themes/smoothness/jquery-ui.css"
        rel="stylesheet" type="text/css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"
        type="text/javascript"></script>
    <!-- Plugins -->
    <script src="plugins/anonymous.js" type="text/javascript"></script>
    <link href="plugins/ui.dropdownchecklist.standalone.css" rel="stylesheet" type="text/css" />
    <script src="plugins/ui.dropdownchecklist.js" type="text/javascript"></script>
    <script src="plugins/jquery.cookies.2.2.0.min.js"
        type="text/javascript"></script>
    <link href="plugins/sticky.css" rel="stylesheet"
        type="text/css" />
    <script src="plugins/sticky.js" type="text/javascript"></script>
    <link href="plugins/jquery.bubblepopup.v2.3.1.css"
        rel="stylesheet" type="text/css" />
    <script src="plugins/jquery.bubblepopup.v2.3.1.min.js"
        type="text/javascript"></script>
    <!-- Load Core -->
    <script src="plugins/core.js" type="text/javascript"></script>
    <style type="text/css">
        .preview-image
        {
            transition: all 0.5s !important;
            -webkit-transition: all 0.5s !important;
            -ms-transition: all 0.5s !important;
            -o-transition: all 0.5s !important;
            position: relative !important;
        }
        .preview-image:hover
        {
            z-index: 100 !important;
            transform: scale(1.6) translate(-50px,90px);
            -webkit-transform: scale(1.6) translate(-50px,90px);
            -ms-transform: scale(1.6) translate(-50px,90px);
            -o-transform: scale(1.6) translate(-50px,90px);
            box-shadow: 3px 3px 3px #5f5f5f;
        }
        #seo-description
        {
            display: none;
        }
        #options #wrapper-options-permalink
        {
            font-size: small;
            line-height: 1;
            position: relative;
            top: 5px;
            right: 0;
        }
        #collection .collection-card .card-faction
        {
            position: absolute;
            top: 1px !important;
            left: 3px !important;
            width: 20px;
            height: 27px;
        }
        #collection .collection-card .card-size
        {
            position: absolute;
            top: 5px !important;
            right: 6px;
            display: block;
            background: transparent !important;
            color: #FFF;
            border-radius: 0px !important;
            -moz-border-radius: 0px !important;
            -ms-border-radius: 0px !important;
            -o-border-radius: 0px !important;
            -webkit-border-radius: 0px !important;
            padding: 0 4px 2px 4px;
            font-family: 'Consolas' , 'Courier New' , monospace;
            font-weight: 500 !important;
        }
    </style>	
    <script type="text/javascript">
			$(document).ready(function() {
				// bootstrap
				Deckbuilder.bootstrap({
					// base url for the page
					page_baseurl: 'http://swogitools-v2.net63.net/',

					// default pagelimit
					pagelimit: 36,

					// Compression
					//  - true = LZW / Base64 + UrlEncode
					//  - false = plainoldstring
					// url's will not break from changing this since the
					// settings are stored within the url and overwrite the
					// setting here :)
					compression: true, // true|false

					// Episodes
					// dynamically load episodes. This is designed to be easy on
					// the mainter so episodes are actually per file as opposed
					// as some monolith; the episode files are also not JSON,
					// although they might look like it. The reason is again to
					// by easier to maintain by providing a more human friendly
					// syntax. File names dictate episode unless the episode
					// filed is not specified. All episodes are expected to be
					// in cards/<episode>
					episodes: ['0', '1', '2', '3', 'EX1', '4', '5', '6', 'EX2' , '7', 'M','UE1', '8', 'EX3', '9', '10', 'UE2', '11', '12', '13', 'EX4', '14', '15', '16', 'UE3', 'EX5', '17', 'UE4', '18', 'EX6', '19', 'UE5', '20', 'EX6'], // Array
					defaultEpisodes: ['20', 'EX6'],
					// [!!] required even when statics are set since it's used
					// for interface features

					// Releases
					// Overwrites any release information when set
					releases: {
						episodes: ['0', '1', '2', '3', 'EX1', '4', '5', '6', 'EX2' , '7', 'M','UE1', '8', 'EX3', '9', '10', 'UE2', '11', '12', '13', 'EX4', '14', '15', '16', 'UE3', 'EX5', '17', 'UE4', '18', 'EX6', '19', '20'], // Array
						cards: [100089, 210030, 210031, 210032],
					},

					// Card sizes
					sizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Array

					// Rarity
					rarity: ['Common', 'Uncommon', 'Rare', 'D.Rare', 'T.Rare', 'Event', 'Prize', 'Imperial'], // Array
					defaultRarity: ['Rare','D.Rare'],
					//defaultRarity: 'null',

					// Factions
					factions: ['Vita', 'Academy', 'Crux', 'Darklore', 'SG', 'Empire'], // Array

					// --- Static Options --------------------------------------
					// the following are meant for creating self contained
					// versions of the application.

					// Static versions of the episodes. Note you can generate
					// monolith files with out worrying too much, just make sure
					// to set the episode since there are no files to guess it
					statics: Loader.cards, // null|Array
					// [!!] overwrites episodes as loading mechanism

					// Base64 encodes of all http://swogitools-v2.net63.net/assets (the core http://swogitools-v2.net63.net/assets, specified
					// in CSS, etc should be picked up automatically so no need
					// for those; some are already base64 there anyway). Pretty
					// much all (known) browsers support them, since the
					// operation is so basic. And those that don't don't matter;
					// since they couldn't open .mht anyway =P (mht = base64 of
					// everything to begin with). The application will use the
					// base64 encoded version of the image instead of computing
					// an url for the src attribute on images
					datastream: null, // Loader.datastream, // null|Array
					// format: { 'usual/url/part': 'data:image/jpeg;base64,iVBORw0KGgoA...' }
				});

				//Deckbuilder.help('Tip: Click cards to view and add. Click cards again in deck to remove. Have fun! :)');

			});
	</script>
    <!--[if lt IE 10]>
		<style type="text/css">
			/* fix alignment by removing styleing =/ */
			#previewwindow .style-wrapper #style-preview-ctl,
			#previewwindow .style-wrapper #style-preview-ctr
			{ display: none !important; }
		</style>
		<![endif]-->
</head>
<body class="SGO-cardbuilder">
    <script type="text/javascript">
        document.body.id = 'javascript-enabled'
	</script>
    <p id="seo-description">
        Deck builder for the Sword Girls online card game. Check out the forum at http://www.swordgirlsonline.com/
        for more information.</p>
    <div id="loadscreen" class="noscript">
        <big>Loading...</big>
        <br />
        <small>Please make sure javascript is enabled.</small>
    </div>
    <div id="page">
        <div id="js-cardbuilder">
            <table>
                <tr>
                    <td id="deckwindow" rowspan="2">
                        <div class="wrapper1-deckwindow">
                            <div class="wrapper2-deckwindow">
                                <span id="style-leftribbon"></span><span id="style-rightribbon"></span>
                                <div id="options">
                                    <button class="options-save">
                                        Save</button>
                                    <button class="options-load">
                                        Load</button>
                                    <button class="options-clear">
                                        Clear</button>
                                    <div id="wrapper-options-permalink">									
                                        <a target="_blank" class="options-permalink" href="#">Link to this deck (Quick View)</a>
                                        / <a target="_blank" href="http://goo.gl/">goo.gl</a>
                                    </div>
                                    <br />
                                    <hr />
                                    <div class="options-name">
                                        <em>Unsaved Deck</em></div>
                                    <div class="options-notice">
                                    </div>
                                    <hr />
                                </div>
                                <div id="wrapper-character">
                                    <table id="character">
                                        <tr>
                                            <td id="characterwindow" class="extended-format">
                                                <img class="character-image" src="http://swogitools-v2.net63.net/assets/null.gif" width="320"
                                                    height="480" alt="Sword Girls game, Character card" />
                                            </td>
                                            <td>
                                                <div id="characterinfowindow">
                                                    <p>
                                                        <big class="character-name"></big>
                                                    </p>
                                                    <p class="character-info extended-format">
                                                        <span class="character-life">♥</span><span class="character-lifecount">30</span>
                                                        / <span class="character-pointcount"></span><strong>points</strong>
                                                    </p>
                                                    <p class="character-ability extended-format">
                                                    </p>
                                                    <img class="character-faction extended-format" src="http://swogitools-v2.net63.net/assets/null.gif"
                                                        alt="" width="36" height="48" />
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                <div id="wrapper-cardlist-deck">
                                    <div id="sorting">
                                        <a class="sorting-sortbysize" href="#">Sort by Size</a> / <a class="sorting-sortbytype"
                                            href="#">Sort by Type</a> / <span class="sorting-showcase"><s>Showcase</s></span>
                                        / <span class="sorting-view"><s>Analyzer</s></span>
                                    </div>
                                    <div class="style-wrapper">
                                        <span id="style-cardlist-ctl"></span><span id="style-cardlist-ctr"></span><span id="style-cardlist-cbl">
                                        </span><span id="style-cardlist-cbr"></span>
                                        <table id="cardlist">
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="analysis">
                                        <span class="analysis-followercount">0</span> <strong>followers</strong> / <span
                                            class="analysis-spellcount">0</span> <strong>spells</strong> / <span class="analysis-pointcount">
                                                0</span> <strong>points</strong>
                                        <br />
                                        <hr />
                                        Total <span class="analysis-cardcount">0</span> / 30
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td rowspan="2" id="linksspacer">
                    </td>
                    <td rowspan="2" id="linkswindow">
                        <a class="mainsite-link" href="?">
                            <img src="http://swogitools-v2.net63.net/assets/null.gif" width="320" height="480" alt="" />
                        </a><a class="sgo-link" target="_blank" href="http://www.swordgirlsonline.com/">
                            <img src="http://swogitools-v2.net63.net/assets/SGO-banner.png" width="200" height="79"
                                alt="Sword Girls game, banner" />
                        </a>
                        <ul id="useful-links">
                            <li><span><strong>Details and showcase by hikky</strong>
                                <br />
								<br />
                                <a target="_blank" href="http://www.tinyurl.com/fakeswogitools">
                                    FakeSwordGiTools</a>                                
                                <br />
                                Need resource, there is no image for Cards no: <a target="_self" href="http://swogitools-v2.net63.net/?filter=110280&rarity=Uncommon&episodes=EX4&sizes=&types=character%2Cnpc&factions=darklore&archetypes=">
                                    110280</a>, <a target="_self" href="http://swogitools-v2.net63.net/?filter=200467&rarity=Event&episodes=6&sizes=1&types=all%2Ccharacter%2Cfollower%2Cspell%2Cmaterial%2Cnpc&factions=sg&archetypes=">
                                        200467</a>, <a target="_self" href="http://swogitools-v2.net63.net/?filter=300581&rarity=Event&episodes=EX2&sizes=3&types=follower&factions=sg&archetypes=%2Bprs%20-glm">
                                            300581</a>.</span>
                                <br />
                                <br />
                                <a href="http://info.flagcounter.com/35WW">
                                    <img src="http://s10.flagcounter.com/count/35WW/bg_FFFFFF/txt_000000/border_CCCCCC/columns_3/maxflags_6/viewers_0/labels_0/pageviews_0/flags_0/"
                                        alt="Flag Counter" border="0" /></a>
                                <br />
                                <a href="http://www.000webhost.com/" target="_blank">http://www.000webhost.com/</a>
                            </li>
                            <li><a href="http://www.swordgirlsonline.com/forum/search.php?do=getdaily" target="_blank">
                                forums</a> [<a target="_blank" href="http://www.swordgirlsonline.com/forum/">categories</a>]</li>
                            <li><a href="irc://irc.rizon.net/SwordGirls" target="_blank">#SwordGirls @ irc.rizon.net</a></li>
                            <li><a href="http://tinyurl.com/sg-spreadsheet" target="_blank">Spreadsheet</a></li>
                            <li><a href="http://tinyurl.com/swordgirlscardlist" target="_blank">Spoilers</a></li>
                            <li><a href="http://www.facebook.com/swordgirls" target="_blank">Swordgirls@facebook</a></li>
                            <li><a href="http://www.facebook.com/pages/Sword-Girls-Deck-Builder/327607743938947">
                                swogitools@facebook</a></li>
                            <li><a href="https://plus.google.com/113604133062343040318?prsrc=3" style="text-decoration: none;">
                                <img src="https://ssl.gstatic.com/images/icons/gplus-16.png" alt="" style="border: 0;
                                    width: 16px; height: 16px;" />
                            </a></li>
                            <li><a href="http://swordgirls.wikia.com/wiki/Sword_Girls_Wiki">SG Community Wikia</a></li>
                            <li><a href="http://swordgirls.info">SwordGirls.info</a></li>
                            <li>Updated: 12/07/2013 using data from <a href="http://tinyurl.com/swordgirlscardlist"
                                target="_new">hikki's list</a></li>
                            <li>by jofori89 - Contact in at Sword girls forum</li>
                        </ul>
                    </td>
                    <td colspan="2">
                        <div class="style-wrapper">
                            <span id="style-collection-controls-cbl"></span>
                            <div id="collection-controls">
                                <div id="style-collection-controls-2">
                                    <div id="filterswrapper">
                                        <span id="episode-selectwrapper" class="nowrap">Episode:&nbsp;<select class="controls-episode js-multiselect"
                                            multiple="multiple"></select>
                                        </span><span id="size-selectwrapper" class="nowrap">Size:&nbsp;<select class="controls-size js-multiselect"
                                            multiple="multiple"></select>
                                        </span><span class="nowrap">Rarity:&nbsp;<select class="controls-rarity js-multiselect"
                                            multiple="multiple"></select>
                                        </span><span id="faction-selectwrapper" class="nowrap">Faction:&nbsp;<select class="controls-faction js-multiselect"
                                            multiple="multiple"></select>
                                        </span><span id="type-selectwrapper" class="nowrap">Type:&nbsp;<select class="controls-type js-multiselect"
                                            multiple="multiple"></select>
                                        </span><span class="nowrap">Gift Effect:&nbsp;<select class="controls-archetype js-multiselect"
                                            multiple="multiple"></select>
                                        </span>
                                        <hr />
                                    </div>
                                    <div>
                                        <input class="controls-filter" type="text" placeholder="Filter..." />
                                        <strong class="controls-filterhelp">Help?</strong> <a href="#" id="filtertoggle">Hide
                                            Filters</a> &nbsp; <span class="controls-pager nowrap">
                                                <button class="pager-prev">
                                                    Prev</button>
                                                <button class="pager-next">
                                                    Next</button>
                                                <span class="pager-pages">Page <strong class="controls-page">1</strong> of <span
                                                    class="controls-pagecount">1</span> &mdash;
                                                    <input class="pager-pagelimit" type="number" value="30" />
                                                    per page </span></span><span class="nowrap"><span id="dbinfo"></span>(<a href="#"
                                                        title="Click to toggle" id="interface-toggle">Compact</a>)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="style-wrapper">
                            <span id="style-collection-ctl"></span><span id="style-collection-ctr"></span><span
                                id="style-collection-cbl"></span><span id="style-collection-cbr"></span>
                            <div id="style-collection-wrapper-1">
                                <div id="style-collection-wrapper-2">
                                    <small id="sortinfo">Sorted by Faction, Type and Size. <a id="collection_reset">Reset</a>
                                        <a id="collection_selection" target="_blank" href="http://swogitools-v2.net63.net/">
                                            <b>Link to this filter</b></a> (<a target="_blank" href="http://goo.gl/">goo.gl</a>)</small>
                                    <ul id="collection">
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td id="previewwindow">
                        <div class="style-wrapper">
                            <span id="style-preview-ctl"></span><span id="style-preview-ctr"></span><span id="style-preview-cbl">
                            </span><span id="style-preview-cbr"></span>
                            <div id="style-preview-wrapper-1">
                                <div id="preview">
                                    <img class="preview-image" src="http://swogitools-v2.net63.net/assets/null.gif" width="320"
                                        height="480" alt="" />
                                    <br />
                                    <img class="preview-characterfaction" src="http://swogitools-v2.net63.net/assets/null.gif"
                                        alt="" />
                                    <big class="preview-name"></big>
                                    <hr />
                                    <span class="preview-cardstats"></span><span class="preview-cardsize"></span>
                                    <table class="preview-info">
                                        <tbody>
                                        </tbody>
                                    </table>
                                    <div class="preview-cardcopy-update">
                                        <a id="library-add">Add to Library</a> <a id="library-remove">Remove</a></div>
                                    <p class="preview-ability">
                                    </p>
                                    <p class="preview-text">
                                    </p>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>
<!-- Hosting24 Analytics Code -->
<script type="text/javascript" src="http://stats.hosting24.com/count.php"></script>
<!-- End Of Analytics Code -->