/**
* ISC license
*
* Copyright (c) 2012, pocketdragon <http://www.swordgirlsonline.com/forum />
*
* Permission to use, copy, modify, and/or distribute this software for any
* purpose with or without fee is hereby granted, provided that the above
* copyright notice and this permission notice appear in all copies.
*
* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

/**
 * ISC license
 *
 * Copyright (c) 2012, pocketdragon <http://www.swordgirlsonline.com/forum />
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
var hostImage = "assets/swordgirlsimages/full/";
var hostThumbImage = "assets/swordgirlsimages/thumbnail/";

var Deckbuilder = {
    version: '3',
    revision: '0',

    // internal-processing
    selectionAltered: false,
    init: true,
    selection: [],
    episodes: [],
    episodes_loaded: 0,
    selectedcard: null,
    preview: null,
    filter: '',
    saves: [],
    serial: '',
    showcaseserial: '',
    library: [],
    library_ids: [],
    current_save: null,
    locked: false,
    loaddialog: null,
    testdialog: null,
    testdialog_help: null,
    viewdeck: [],
    unaltered_viewdeck: [],
    testdialog_round: 1,
    shuffles: 0,
    compact: false,
    showfilters: false,

    // general
    page: 1,
    pagecount: 1,
    pagelimit: 40,
    deck: {
        character: null,
        cards: [],
        sortOrder: this.typeSort
    },
    cards: [],

    /**
         * Application defaults.
         */
    options: {
        // base url for the page
        page_baseurl: 'http://swogitools-v2.net63.net/',

        // default pagelimit
        pagelimit: 25,

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
        episodes: [
            '0', '1', '2', '3', 'EX1', '4', '5', '6', 'EX2', '7', 'M', 'UE1',
            '8', 'EX3', '9', '10', 'UE2', '11', '12', '13', 'EX4', '14', '15', '16', 'UE3',
            'EX5', '17', 'UE4', '18', 'EX6', '19', 'UE5', '20'
        ], // Array
        defaultEpisodes: ['0', '1'],
        // [!!] required even when statics are set since it's used
        // for interface features

        // Releases
        // Overwrites any release information when set
        releases: {
            episodes: [
                '0', '1', '2', '3', 'EX1', '4', '5', '6', 'EX2', '7', 'M', 'UE1',
                '8', 'EX3', '9', '10', 'UE2', '11', '12', '13', 'EX4', '14', '15', '16', 'UE3',
                'EX5', '17', 'UE4', '18', 'EX6', '19'
            ], // Array
            cards: [100089, 210030, 210031, 210032]
        },

        // Card sizes
        sizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Array

        // Rarity
        rarity: ['Common', 'Uncommon', 'Rare', 'D.Rare', 'T.Rare', 'Event', 'Prize', 'Imperial'], // Array
        defaultRarity: ['Rare', 'D.Rare'],
        //defaultRarity: 'null',

        // Factions
        factions: ['Vita', 'Academy', 'Crux', 'Darklore', 'SG', 'Empire'], // Array

        // --- Static Options --------------------------------------
        // the following are meant for creating self contained
        // versions of the application.

        // Static versions of the episodes. Note you can generate
        // monolith files with out worrying too much, just make sure
        // to set the episode since there are no files to guess it
        statics: [], // null|Array
        // [!!] overwrites episodes as loading mechanism

        // Base64 encodes of all assets (the core assets, specified
        // in CSS, etc should be picked up automatically so no need
        // for those; some are already base64 there anyway). Pretty
        // much all (known) browsers support them, since the
        // operation is so basic. And those that don't don't matter;
        // since they couldn't open .mht anyway =P (mht = base64 of
        // everything to begin with). The application will use the
        // base64 encoded version of the image instead of computing
        // an url for the src attribute on images
        datastream: null // Loader.datastream, // null|Array
        // format: { 'usual/url/part': 'data:image/jpeg;base64,iVBORw0KGgoA...' }
    },
    // #cardlist .cardlist-card
    templateCardlistCard: function (card) {
        var cardcompletion = 'none';
        if (Deckbuilder.library[card.id] != undefined) {
            if (card.copies <= Deckbuilder.library[card.id]) {
                cardcompletion = 'all';
            } else if (Deckbuilder.library[card.id] >= 1) {
                cardcompletion = 'some';
            }
        }

        var factionImg = Deckbuilder.img('assets/' + card.faction + '-20w.png');
        var cardImg = Deckbuilder.img(hostImage + card.id + 'L.jpg');
        var cardThumbImg = Deckbuilder.img(hostThumbImage + card.id + '.jpg');

        return '<tr class="cardlist-card type-' + card.type + '">\
                        <td class="card-fullimage">\
                            <div class="wrapper-firefox-fix">\
                                <div class="wrapper-cardbg">\
                                    <img class="cardbg" data-cardid="' + card.id + '" alt="' + card.name
            + '" title="' + card.name + '" src="' + cardImg + '" onerror="showBackupImage(this)" />\
                                </div>\
                            </div>\
                        </td>\
                        <td class="card-faction">\
                            <div class="wrapper-card-faction">\
                                <img data-cardid="' + card.id + '" alt="" src="' + factionImg + '" />\
                            </div>\
                        </td>\
                        <td class="card-size copies-' + cardcompletion + '">' + card.size + '</td>\
                        <td class="card-info ' + card.type + '">\
                            <div class="wrapper-info">\
                                <big title="' + (card.type == 'follower' ? card.stats.atk + ' / ' + card.stats.def + ' / ' + card.stats.stm : 'Spell') + '" data-cardid="' + card.id + '" class="card-name"><a href="card.html?id=' + card.id + '" target="_blank">' + card.name + '</a></big>\
                            </div>\
                        </td>\
                        <td class="card-thumb"><img class="card-thumbnail" date-index="' + card.id + '" src="' + cardThumbImg + '" title="' + card.name + '" onerror="showBackupImage(this)" alt="' + card.name + '" /></td>\
                        <td class="card-timessymbol">&times;</td>\
                        <td class="card-copies" date-cardid="' + card.id + '">' + card.copies + '</td>\
                    </tr>';
    },

    // #preview .preview-info (follower)
    templateCardPreview_Follower: function (card) {
        return '<tr><th>Episode</th><td>' + card.episode + '</td></tr>\
                    <tr><th>Points</th><td>' + card.CP + '</td></tr>\
                    <tr><th>Rarity</th><td>' + card.rarity + '</td></tr>\
                    <tr><th>Limit</th><td>' + card.limit + '</td></tr>\
                    ' + (card.artist != '' ? '<tr><th>Artist</th><td><a style="text-decoration: none;" href="./?filter=' + card.artist + '&episodes=All" target="_self" >' + card.artist + '</a></td></tr>' : '') + '\
                    ' + (card.krname != '' ? '<tr><th>Korean</th><td><a style="color:#55F; text-decoration:none;" href="http://www.sword-girls.co.kr/World/Card/View.aspx?CardNo=' + card.id + '" target="_blank">' + card.krname + '</a></td></tr>' : '') + '\
                    <tr><th>ID</th><td>' + card.id + '</td></tr>\
                    <tr><th>Library</th><td>' + (Deckbuilder.library[card.id] != undefined ? Deckbuilder.library[card.id] : 0) + '</td></tr>';
    },

    // #preview .preview-info (spell)
    templateCardPreview_Spell: function (card) {
        return '<tr><th>Episode</th><td>' + card.episode + '</td></tr>\
                    <tr><th>Points</th><td>' + card.CP + '</td></tr>\
                    <tr><th>Rarity</th><td>' + card.rarity + '</td></tr>\
                    <tr><th>Limit</th><td>' + card.limit + '</td></tr>\
                    ' + (card.artist != '' ? '<tr><th>Artist</th><td><a style="text-decoration: none;" href="./?filter=' + card.artist + '&episodes=All" target="_self" >' + card.artist + '</a></td></tr>' : '') + '\
                    ' + (card.krname != '' ? '<tr><th>Korean</th><td><a style="color:#555; text-decoration:none;" href="http://www.sword-girls.co.kr/World/Card/View.aspx?CardNo=' + card.id + '" target="_blank">' + card.krname + '</a></td></tr>' : '') + '\
                    <tr><th>ID</th><td>' + card.id + '</td></tr>\
                    <tr><th>Library</th><td>' + (Deckbuilder.library[card.id] != undefined ? Deckbuilder.library[card.id] : 0) + '</td></tr>';
    },

    // #preview .preview-info (character)
    templateCardPreview_Character: function (card) {
        return '<tr><th>Episode</th><td>' + card.episode + '</td></tr>\
                    <tr><th>Points</th><td>' + card.CP + '</td></tr>\
                    <tr><th>Rarity</th><td>' + card.rarity + '</td></tr>\
                    ' + (card.artist != '' ? '<tr><th>Artist</th><td><a style="text-decoration: none;" href="./?filter=' + card.artist + '&episodes=All" target="_self" >' + card.artist + '</a></td></tr>' : '') + '\
                    ' + (card.krname != '' ? '<tr><th>Korean</th><td><a style="color:#F55; text-decoration:none;" href="http://www.sword-girls.co.kr/World/Card/View.aspx?CardNo=' + card.id + '" target="_blank">' + card.krname + '</a></td></tr>' : '') + '\
                    <tr><th>ID</th><td>' + card.id + '</td></tr>';
    },

    // #collection .collection-card
    templateCollectionCard_Follower: function (card) {
        var factionImg = Deckbuilder.img('assets/' + card.faction + '.png');
        var cardThumbImg = Deckbuilder.img(hostThumbImage + card.id + '.jpg');

        return '<li data-cardid="' + card.id + '" class="collection-card faction-' + card.faction + '">\
                    <img data-cardid="' + card.id + '" class="card-image" src="' + cardThumbImg + '" title="' + card.name + '" onerror="showBackupImage(this)" width="120" height="180" alt="' + card.name + '" />\
                    <span class="card-size">' + card.size + '</span>\
                    <span class="card-stats"><span class="stats-atk">' + card.stats.atk + '</span><span class="stats-def">' + card.stats.def + '</span><span class="stats-stm">' + card.stats.stm + '</span></span>\
                    <img class="card-faction" data-cardid="' + card.id + '" src="' + factionImg + '" alt="" />\
                    ' + (!card.released ? '<span class="card-status">Unreleased</span>' : '') +
            (!card.playable ? '<span class="card-playable">NPC Card</span>' : '') + '\
                </li>';
    },

    // #collection .collection-card
    templateCollectionCard_Spell: function (card) {
        var factionImg = Deckbuilder.img('assets/' + card.faction + '.png');
        var cardThumbImg = Deckbuilder.img(hostThumbImage + card.id + '.jpg');

        return '<li class="collection-card faction-' + card.faction + '">\
                    <img data-cardid="' + card.id + '" class="card-image" src="' + cardThumbImg + '" title="' + card.name + '" onerror="showBackupImage(this)" width="120" height="180" alt="' + card.name + '" />\
                    <span class="card-size">' + card.size + '</span>\
                    <img class="card-faction" data-cardid="' + card.id + '" src="' + factionImg + '" alt="" />\
                    ' + (!card.released ? '<span class="card-status">Unreleased</span>' : '') +
            (!card.playable ? '<span class="card-playable">NPC Card</span>' : '') + '\
                </li>';
    },

    // #collection .collection-card
    templateCollectionCard_Character: function (card) {
        var factionImg = Deckbuilder.img('assets/' + card.faction + '.png');
        var cardThumbImg = Deckbuilder.img(hostThumbImage + card.id + '.jpg');

        return '<li class="collection-card faction-' + card.faction + '">\
                    <img data-cardid="' + card.id + '" class="card-image" '
            + 'alt="' + card.name + '" '
            + 'title="' + card.name + '" '
            + 'src="' + cardThumbImg + '" onerror="showBackupImage(this)" '
            + 'width="120" height="180" />\
                    <span class="card-life"><span class="life-symbol">♥</span><span class="life-count">' + card.life + '</span></span>\
                    <img class="card-faction" data-cardid="' + card.id + '" src="' + factionImg + '" alt="" />\
                    ' + (!card.released ? '<span class="card-status">Unreleased</span>' : '') +
            (!card.playable ? '<span class="card-playable">NPC Card</span>' : '') + '\
                </li>';
    },

    // #collection .collection-card
    templateCollectionCard_Material: function (card) {
        var factionImg = Deckbuilder.img('assets/' + card.faction + '.png');
        var cardThumbImg = Deckbuilder.img(hostThumbImage + card.id + 'L.jpg');

        return '<li class="collection-card faction-' + card.faction + '">\
                    <img data-cardid="' + card.id + '" class="card-image" src="' + cardThumbImg +
            '" title="' + card.name + '" onerror="showBackupImage(this)" width="120" height="180" alt="" />\
                    <img class="card-faction" data-cardid="' + card.id + '" src="' + factionImg + '" alt="' + card.name + '" />\
                    ' + (!card.released ? '<span class="card-status">Unreleased</span>' : '') + '\
                </li>';
    },

    // internal
    templateDeckLoadWindow: function (i, saves) {
        return '<li data-idx="' + i + '"><a class="saves-saveddeck" data-saveid="' + saves[i].id + '">' + saves[i].name + '</a>\
                    <img data-id="' + saves[i].id + '" class="saves-edit" src="' + Deckbuilder.img('assets/edit.png') + '" alt="" />\
                    <img data-id="' + saves[i].id + '" class="saves-del" src="' + Deckbuilder.img('assets/close.png') + '" alt="" /></li>';
    },

    // internal
    templateViewDeckCard: function (card, cardnumber) {
        var cardImg = Deckbuilder.img(hostImage + card.id + 'L.jpg');

        return '<li class="' + (cardnumber > 5 ? 'deck-card' : 'hand-card') + '">\
                    <img class="testdeck-card" '
            + 'data-cardidx="' + card.viewdeck_idx + '" '
            + 'alt="' + card.name
            + '" title="' + card.name + '" '
            + 'src="' + cardImg + '" onerror="showBackupImage(this)" '
            + 'width="120" height="180" />\
                    <span class="cover state-' + card.state + '" data-cardidx="' + card.viewdeck_idx + '"></span>\
                    <span class="size">' + card.size + '</span>\
                    <span class="controls">\
                        <span class="inc-size" data-cardidx="' + card.viewdeck_idx + '">+size</span>\
                        <span class="dec-size" data-cardidx="' + card.viewdeck_idx + '">-size</span>\
                    </span>\
                </li>';
    },

    /**
         * Add card to deck. Also performs any insertion of defaults when necesary.
         */
    addCard: function (card, episode) {
        // card type
        if (card.life !== undefined) {
            card.type = 'character';
        } else if (card.stats !== undefined) {
            card.type = 'follower';
            card.archetype = card.id % 2 == 0 ? '+sns -wis' : '+prs -glm';
        } else if (card.size !== undefined) {
            card.type = 'spell';
            card.archetype = card.id % 2 == 0 ? '+wis -sns' : '+glm -prs';
        } else // matrial
        {
            card.type = 'material';
        }
        // set episode
        if (card.episode == undefined) {
            card.episode = episode;
        }
        // release check
        if (Deckbuilder.options.releases != null) {
            if ($.inArray(card.episode, Deckbuilder.options.releases.episodes) != -1 || $.inArray(card.id, Deckbuilder.options.releases.cards) != -1) {
                card.released = true;
            } else // set it to unreleased
            {
                card.released = false;
            }
        } else // no release information
        {
            // set release
            if (card.released == undefined) {
                card.released = true;
            }
        }

        // add card
        this.cards.push(card);
    },

    /**
         * Retrieve image.
         */
    img: function (url) {
        if (!Deckbuilder.options.datastream) {
            // no datastream, no extra work required :)
            return url;
        } else // use datastream
        {
            return Deckbuilder.options.datastream[url];
        }
    },

    /**
    * Bootstrap the application
    */

    bootstrap: function (options) {
        // inject defaults on missing fields
        Deckbuilder.options = $.extend(true, Deckbuilder.options, options);

        // make sure localStorage is in check
        Deckbuilder.restoreLocalStorage();
        Deckbuilder.loadLibrary();

        // configure cookies
        $.cookies.setOptions({ expiresAt: new Date(3000, 1, 1) });

        var allOption = ['All'];
        // set episodes in select fields
        var episodes = allOption.concat(Deckbuilder.options.episodes);
        $('#collection-controls .controls-episode').empty();
        var i;
        for (i = 0; i < episodes.length; ++i) {
            $('#collection-controls .controls-episode')
                .append('<option value="' + episodes[i] + '" selected>' + episodes[i] + '</option>');
        }
        if (Deckbuilder.options.defaultEpisodes != null) {
            $('#collection-controls .controls-episode option:selected').removeAttr("selected");
            $('#collection-controls .controls-episode').val(Deckbuilder.options.defaultEpisodes);
        }

        // set sizes for select fields
        var sizes = allOption.concat(Deckbuilder.options.sizes);
        $('#collection-controls .controls-size').empty();
        for (i = 0; i < sizes.length; ++i) {
            $('#collection-controls .controls-size')
                .append('<option value="' + sizes[i] + '" selected>' + sizes[i] + '</option>');
        }

        // set rarity for select fields
        var rarity = allOption.concat(Deckbuilder.options.rarity);
        $('#collection-controls .controls-rarity').empty();
        for (i = 0; i < rarity.length; ++i) {
            $('#collection-controls .controls-rarity')
                .append('<option value="' + rarity[i] + '" selected>' + rarity[i] + '</option>');
        }

        // set factions for select fields
        var factions = allOption.concat(Deckbuilder.options.factions);
        $('#collection-controls .controls-faction').empty();
        for (i = 0; i < factions.length; ++i) {
            $('#collection-controls .controls-faction')
                .append('<option value="' + factions[i].toLowerCase() + '" selected>' + factions[i] + '</option>');
        }

        // set types for select fields
        var types = allOption.concat(['Character', 'Follower', 'Spell', 'Material', 'NPC']);
        $('#collection-controls .controls-type').empty();
        for (i = 0; i < types.length; ++i) {
            $('#collection-controls .controls-type')
                .append('<option value="' + types[i].toLowerCase() + '" selected>' + types[i] + '</option>');
        }
        $('#collection-controls .controls-type option[value="all"]').removeAttr('selected');
        $('#collection-controls .controls-type option[value="npc"]').removeAttr('selected');
        $('#collection-controls .controls-type option[value="material"]').removeAttr('selected');
        $('#collection-controls .controls-type').change();

        // set archetypes for select fields
        types = allOption.concat(['+GLM -PRS', '+WIS -SNS', '+PRS -GLM', '+SNS -WIS']);
        $('#collection-controls .controls-archetype').empty();
        for (i = 0; i < types.length; ++i) {
            $('#collection-controls .controls-archetype')
                .append('<option value="' + types[i].toLowerCase() + '" selected>' + types[i] + '</option>');
        }

        // check and setup filters
        Deckbuilder.filter = getParameterByName('filter');
        $('#collection-controls .controls-filter').val(Deckbuilder.filter);
        var list = Deckbuilder.decodeURIList(getParameterByName('episodes'));
        if (list.length != 0) {
            $('#collection-controls .controls-episode option:selected').removeAttr("selected");
            $('#collection-controls .controls-episode').val(list);
        }
        list = Deckbuilder.decodeURIList(getParameterByName('sizes'));
        if (list.length != 0) {
            $('#collection-controls .controls-size option:selected').removeAttr("selected");
            $('#collection-controls .controls-size').val(list);
        }
        list = Deckbuilder.decodeURIList(getParameterByName('rarity'));
        if (list.length != 0) {
            $('#collection-controls .controls-rarity option:selected').removeAttr("selected");
            $('#collection-controls .controls-rarity').val(list);
        }
        list = Deckbuilder.decodeURIList(getParameterByName('factions'));
        if (list.length != 0) {
            $('#collection-controls .controls-faction option:selected').removeAttr("selected");
            $('#collection-controls .controls-faction').val(list);
        }
        list = Deckbuilder.decodeURIList(getParameterByName('types'));
        if (list.length != 0) {
            $('#collection-controls .controls-type option:selected').removeAttr("selected");
            $('#collection-controls .controls-type').val(list);
        }
        list = Deckbuilder.decodeURIList(getParameterByName('archetypes'));
        if (list.length != 0) {
            $('#collection-controls .controls-archetype option:selected').removeAttr("selected");
            $('#collection-controls .controls-archetype').val(list);
        }

        //// jquery multiselect
        $('.js-multiselect').dropdownchecklist({
            emptyText: "none",
            firstItemChecksAll: true
        });

        // collection reset switch
        $('#collection_reset').click(function () {
            $('#collection-controls option').attr('selected', 'selected');
            if (Deckbuilder.options.defaultEpisodes != null) {
                $('#collection-controls .controls-episode option:selected').removeAttr("selected");
                $('#collection-controls .controls-episode').val(Deckbuilder.options.defaultEpisodes);
            }

            $('#collection-controls select').change();
            $('#collection-controls .controls-filter').val('');
        });

        // setup deck sorting
        $('#sorting .sorting-sortbytype').click(function () {
            Deckbuilder.deck.sortOrder = Deckbuilder.typeSort;
            Deckbuilder.refreshDeck();
            return false;
        });
        $('#sorting .sorting-sortbysize').click(function () {
            Deckbuilder.deck.sortOrder = Deckbuilder.sizeSort;
            Deckbuilder.refreshDeck();
            return false;
        });

        // setup deck testing view
        Deckbuilder.testdialog = $('<div id="testdialog"></div>')
            .html('<button id="testdialog-new">New</button>\
                        <button id="testdialog-reset">Reset</button>\
                        <button id="testdialog-shuffle">Shuffle</button>\
                        <button id="testdialog-nextround">Next Round</button>\
                        <small><a href="#" id="testdialog-help">Help</a></small>\
                        <hr />Field Size: <span id="testdialog-fieldsize">0</span><hr />\
                        <ul id="testdialog-cards"></ul>')
            .dialog({
                autoOpen: false,
                title: 'Analyze Deck',
                width: 800,
                position: [300, 100]
            });
        Deckbuilder.testdialog_help = $('<div id="testdialog-helptext"></div>')
            .html('<p>The Deck Analyzer is used to visualize an imaginary scenario for your deck. This permits you to visualize\
                    probabilities in a intuitive way and also solve basic issues when creating a deck. You can do simple things\
                    such as see what hand you stand to get and how effective shuffles are, and you can also do more complex things\
                    such as enact an imaginary scenario.</p>\
                    <p>It\'s not as good as an actual game but it\'s better then a calculator and numeric probabilities.</p>\
                    <p>To mark cards simply click them. The color coding is as follows:</p>\
                    <dl>\
                        <dt>Black Outline</dt>\
                            <dd>You have the card in your hand and have yet to do anything with it.</dd>\
                        <dt>Light Gray Outline</dt>\
                            <dd>You have the card in your deck and have yet to gain access to it.</dd>\
                        <dt>Orange Outline</dt>\
                            <dd>You\'ve played the card on the current round.</dd>\
                        <dt>Green Overlay (followers-only)</dt>\
                            <dd>You\'ve played the card in a previous round and it\'s still on the field.</dd>\
                        <dt>Red Overlay</dt>\
                            <dd>The card has been destroyed, sent to the grave or consumed by another card.</dd>\
                    </dl>\
                    <p>Remember, the emulation is all about your imagination. There are no actual rules. If you want to mark things \
                    in the middle of the deck to simulate a Dress Up or to simulate some strange effect the removes cards, just do it.</p>'
            )
            .dialog({
                autoOpen: false,
                title: 'Help',
                width: 500,
            });
        $('#DeckViewer').on('click', function (event) {
            Deckbuilder.testdialog_round = 1;
            Deckbuilder.shuffles = 0;
            Deckbuilder.testdialog.dialog('open');
            Deckbuilder.testdialogInit();
            event.preventDefault();
        });
        $('#testdialog-help').on('click', function (event) {
            Deckbuilder.testdialog_help.dialog('open');
            event.preventDefault();
        });
        $('#testdialog-shuffle').on('click', function (event) {
            Deckbuilder.shuffle(Deckbuilder.viewdeck);
            Deckbuilder.shuffles++;
            Deckbuilder.testdialogRefresh();
            event.preventDefault();
        });
        $('#testdialog-new').on('click', function (event) {
            Deckbuilder.testdialog_round = 1;
            Deckbuilder.shuffles = 0;
            Deckbuilder.testdialogInit();
            event.preventDefault();
        });
        $('#testdialog-reset').on('click', function (event) {
            Deckbuilder.viewdeck = Deckbuilder.cloneArray(Deckbuilder.unaltered_viewdeck);
            Deckbuilder.testdialog_round = 1;
            Deckbuilder.shuffles = 0;
            Deckbuilder.testdialogRefresh();
            event.preventDefault();
        });
        $('#testdialog-nextround').on('click', function (event) {
            Deckbuilder.testdialog_round++;
            Deckbuilder.testdialogRefresh();
            event.preventDefault();
        });
        $('#testdialog .cover').on('click', function (event) {
            var idx = parseInt($(this).attr('data-cardidx'));
            var card = null;
            // get card
            for (var i = 0; i < Deckbuilder.viewdeck.length; ++i) {
                if (Deckbuilder.viewdeck[i].viewdeck_idx == idx) {
                    card = Deckbuilder.viewdeck[i];
                    break;
                }
            }
            // cycle states
            if (card.state == 'deck') {
                card.state = 'played-now';
            } else if (card.state == 'played-now') {
                if (card.type == 'spell') {
                    card.state = 'destroyed';
                } else {
                    card.state = 'played';
                }
            } else if (card.state == 'played') {
                card.state = 'destroyed';
            } else if (card.state == 'destroyed') {
                card.state = 'deck';
            }
            Deckbuilder.testdialogRefresh();
            event.preventDefault();
        });
        $('#testdialog .controls .inc-size').on('click', function (event) {
            clearSelection();
            var idx = parseInt($(this).attr('data-cardidx'));
            var card = null;
            // get card
            for (var i = 0; i < Deckbuilder.viewdeck.length; ++i) {
                if (Deckbuilder.viewdeck[i].viewdeck_idx == idx) {
                    card = Deckbuilder.viewdeck[i];
                    break;
                }
            }
            card.size++;
            Deckbuilder.testdialogRefresh();
            event.preventDefault();
        });
        $('#testdialog .controls .dec-size').on('click', function (event) {
            clearSelection();
            var idx = parseInt($(this).attr('data-cardidx'));
            var card = null;
            // get card
            for (var i = 0; i < Deckbuilder.viewdeck.length; ++i) {
                if (Deckbuilder.viewdeck[i].viewdeck_idx == idx) {
                    card = Deckbuilder.viewdeck[i];
                    break;
                }
            }
            if (card != undefined && card.size > 1) {
                card.size--;
            }
            Deckbuilder.testdialogRefresh();
            event.preventDefault();
        });

        // setup filter option
        $('#collection-controls .controls-filter').keyup(function (event) {
            if (event.keyCode == 13) {
                Deckbuilder.filter = $(this).val();
                Deckbuilder.selectionAltered = true;
                Deckbuilder.refresh();
            }
        });
        $('#collection-controls .controls-filter').blur(function () {
            Deckbuilder.filter = $(this).val();
            Deckbuilder.selectionAltered = true;
            Deckbuilder.refresh();
        });
        // setup selects
        $('#collection-controls select').change(function () {
            Deckbuilder.selectionAltered = true;
            Deckbuilder.refresh();
        });
        // setup library functions
        $('#preview #library-add').on('click', function (event) {
            clearSelection();
            var cardid = parseInt($(this).attr('data-cardid'));
            var card = Deckbuilder.copyCardById(cardid);
            if (Deckbuilder.library[cardid] == undefined) {
                if (!card.playable) {
                    Deckbuilder.help("This is a NPC card. You can not add it to your library.");
                } else // card is playable
                {
                    Deckbuilder.library_ids.push(cardid);
                    Deckbuilder.library[cardid] = 1;
                }
            } else // already in library
            {
                Deckbuilder.library[cardid]++;
            }
            Deckbuilder.updatepreview(cardid);
            Deckbuilder.refreshDeck();
            Deckbuilder.saveLibrary();
            event.preventDefault();
            return false;
        });
        $('#preview #library-remove').on('click', function () {
            clearSelection();
            var cardid = parseInt($(this).attr('data-cardid'));
            var card = Deckbuilder.copyCardById(cardid);
            if (Deckbuilder.library[cardid] == undefined) {
                // this should never happen
            } else // already in library
            {
                if (Deckbuilder.library[cardid] != 0) {
                    Deckbuilder.library[cardid]--;
                }
            }
            Deckbuilder.updatepreview(cardid);
            Deckbuilder.refreshDeck();
            Deckbuilder.saveLibrary();
            return false;
        });

        // load window
        $(document).on('click', '#loaddialog-saves .saves-saveddeck', function (event) {
            clearSelection();

            var saveid = $(this).attr('data-saveid');
            for (var i = 0; i < Deckbuilder.saves.length; ++i) {
                if (Deckbuilder.saves[i].id == saveid) {
                    Deckbuilder.lock = false;
                    Deckbuilder.current_save = Deckbuilder.saves[i].id;
                    Deckbuilder.loadDeckUsingSerial(Deckbuilder.saves[i].serial, Deckbuilder.saves[i].compression);
                    Deckbuilder.loaddialog.dialog('close');
                    break;
                }
            }
            return false;
        });

        // is static processing set?
        if (Deckbuilder.options.statics != null) {
            Deckbuilder.staticload(Deckbuilder.options.statics);
        } else // load cards/<episode> files
        {
            Deckbuilder.register(episodes);
        }
        Deckbuilder.selectionAltered = true;
        Deckbuilder.refresh();

        // show facebook like button
        // we keep it hidden because it loads so slow and causes page jitter
        $('#like-buttons').show('slow');

        // check cookies for compact mode
        var mode = $.cookies.get('compactmode');
        if (mode) Deckbuilder.compact = true;

        // compact mode?
        if (Deckbuilder.compact) {
            // hide junk
            $('#linkswindow').hide();
            $('#linksspacer').show();
            $('.sticky-queue').hide();
            $('.extended-format').hide();
            $('#interface-toggle').text('compact');
        }

        Deckbuilder.showfilters = $.cookies.get('showfilters', true);
        if (!Deckbuilder.showfilters) {
            $('#filterswrapper').hide();
            $('#filtertoggle').text('Show Filters');
        }

        $('#filtertoggle').click(function (event) {
            clearSelection();
            if (Deckbuilder.showfilters) {
                Deckbuilder.showfilters = false;
                $.cookies.set('showfilters', false);
                $('#filterswrapper').hide();
                $('#filtertoggle').text('Show Filters');
            } else // showfilters == false
            {
                Deckbuilder.showfilters = true;
                $.cookies.set('showfilters', true);
                $('#filterswrapper').show();
                $('#filtertoggle').text('Hide Filters');
            }
            event.preventDefault();
        });

        $('#interface-toggle').click(function (event) {
            clearSelection();
            if (Deckbuilder.compact) {
                $.cookies.set('compactmode', false);
                Deckbuilder.compact = false;
                $('#linkswindow').show();
                $('#linksspacer').hide();
                $('.extended-format').show();
                $('#interface-toggle').text('Compact');
            } else // compact == false
            {
                $.cookies.set('compactmode', true);
                Deckbuilder.compact = true;
                $('#linkswindow').hide();
                $('#linksspacer').show();
                $('.sticky-queue').hide();
                $('.extended-format').hide();
                $('#interface-toggle').text('Expand');
            }
            event.preventDefault();
        });
    },

    help: function (message) {
        if (!Deckbuilder.compact)
            $.sticky(message);
    },

    /**
         * Clones an array. (ie. breaks references)
         */
    cloneArray: function (arr) {
        var newArr = arr.slice(0);
        for (var i = 0; i < newArr.length; ++i) {
            newArr[i] = $.extend(true, {}, newArr[i]);
        }

        return newArr;
    },

    /**
         * Initializes test dialog.
         */
    testdialogInit: function () {
        var compact_cards = Deckbuilder.deck.cards;
        var expanded_deck = [];
        var card, idx = 0;
        // expand cards
        for (var i = 0; i < compact_cards.length; ++i) {
            for (var j = 0; j < compact_cards[i].copies; ++j) {
                card = $.extend(true, {}, compact_cards[i]);
                // we give each card a unique index by which to identify it
                card.viewdeck_idx = idx++;
                // we default to a deck state
                card.state = 'deck';
                expanded_deck.push(card);
            }
        }
        // shuffle deck
        Deckbuilder.viewdeck = Deckbuilder.shuffleAll(expanded_deck);
        Deckbuilder.unaltered_viewdeck = Deckbuilder.cloneArray(Deckbuilder.viewdeck);
        Deckbuilder.testdialogRefresh();
    },

    /**
         * Refresh test dialog.
         */
    testdialogRefresh: function () {
        $('#testdialog-cards').empty();
        var size = 0;
        var cardnumber = 0;
        for (var i = 0; i < Deckbuilder.viewdeck.length; ++i) {
            if (Deckbuilder.viewdeck[i].state == 'deck' || Deckbuilder.viewdeck[i].state == 'played-now') {
                cardnumber++;
            }
            if ((Deckbuilder.viewdeck[i].state == 'played' && Deckbuilder.viewdeck[i].type == 'follower') || Deckbuilder.viewdeck[i].state == 'played-now') {
                size += Deckbuilder.viewdeck[i].size;
            }
            $('#testdialog-cards').append(Deckbuilder.templateViewDeckCard(Deckbuilder.viewdeck[i], cardnumber));
        }
        // update size
        $('#testdialog-fieldsize').text(size);
        // update round
        $('#testdialog-nextround').text('Next Round (' + Deckbuilder.testdialog_round + ')');
        // update shuffles
        $('#testdialog-shuffle').text('Shuffle (' + Deckbuilder.shuffles + ')');
    },

    /**
         * Shuffles an entire deck
         */
    shuffleAll: function (deck) {
        var output = [];
        var newSrc = deck.slice(0);
        var value, index;

        while (newSrc.length > 0 && output.length < deck.length) {
            index = Math.floor(Math.random() * newSrc.length);
            value = newSrc.splice(index, 1)[0];
            output.push(value);
        }

        return output;
    },

    /**
         * Emulates game "Shuffle" function. Yes it's not random:
         * "Take current cards, place them at the bottom, give out next cards limited to the cards sent."
         */
    shuffle: function (deck) {
        var cardsShuffled = 0;
        var idx = 0;
        while (cardsShuffled < 5) {
            if (deck[idx].state == 'deck') {
                deck.push(deck.splice(idx, 1)[0]);
                ++cardsShuffled;
            } else if (deck[idx].state == 'played-now') {
                ++cardsShuffled;
                ++idx;
            } else {
                ++idx;
            }
        }
    },

    /**
         * Sort by size
         */
    sizeSort: function (a, b) {
        return (a.size - b.size) || Deckbuilder.typeSort(a, b);
    },
    //sharpobject
    /**
         * Sort by type
         */
    typeSort: function (a, b) {
        if (a.type == b.type) {
            if (a.size == b.size)
                return a.id - b.id;
            return a.size - b.size;
        }

        if (a.type == 'follower')
            return -1;

        return +1;
    },

    /**
         * Retrieve index in card list.
         */
    getCardIndex: function (card) {
        for (var i = 0; i < Deckbuilder.cards.length; ++i) {
            if (Deckbuilder.cards[i].id == card.id) {
                return i;
            }
        }

        return null;
    },

    /**
         * Retrieve index in current selected card list.
         */
    getSelectionCardIndex: function (card) {
        for (var i = 0; i < Deckbuilder.selection.length; ++i) {
            if (Deckbuilder.selection[i].id == card.id) {
                return i;
            }
        }

        return null;
    },

    /**
         * Register episodes/cards
         */
    staticload: function (list) {
        for (var i = 0; i < list.length; ++i) {
            try {
                Deckbuilder.addCard(list[i], 'Unknown');
            } catch (e) {
                Deckbuilder.help(e.message + ' \n[potential typo at around the card No. ' + i + ' in ' + value + ']');
            }
        }
        // prevent dynamic loading safety mechanisms from stopping execution
        Deckbuilder.episodes = Deckbuilder.options.episodes;
        Deckbuilder.episodes_loaded = Deckbuilder.episodes.length;
        // set current selection to "everything"
        Deckbuilder.selection = Deckbuilder.cards.slice();
        // sort selection
        Deckbuilder.selection = Deckbuilder.selection.sort(Deckbuilder.defaultSort);
        // refresh
        Deckbuilder.selectionAltered = true;
        Deckbuilder.refresh();
    },

    /**
         * Register episodes. Auto refreshes.
         */
    register: function (list) {
        // set episode list
        Deckbuilder.episodes = list;
        Deckbuilder.episodes_loaded = 0;
        // load the info for each episode
        $.each(list, function (idx, value) {
            // load data
            try {
                // setup XMLHttpRequest; why not just $.getJSON? because we
                // would then have to format all the card files into unreadable
                // json instead of "pretty" javascript files.
                // Json =/= javascript; not from the browser's POV.
                var xmlHttp;
                if (window.XMLHttpRequest) {
                    xmlHttp = new XMLHttpRequest();
                } else if (window.ActiveXObject) {
                    try {
                        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (e) {
                        try {
                            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                        } catch (e) {
                            throw (e);
                        }
                    }
                }
                // make the request
                xmlHttp.open("GET", 'cards/' + value + '.js', true);
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState == 4) {
                        cardlist = eval('(' + xmlHttp.responseText + ')');
                        for (var i = 0; i < cardlist.cards.length; ++i) {
                            // opera gives an array of 2 elements a length of 3 =_="
                            // even shows the nonsense in the inspection window
                            if (cardlist.cards[i] == undefined) break;
                            // add the card
                            card = cardlist.cards[i];
                            try {
                                Deckbuilder.addCard(card, value);
                            } catch (e) {
                                Deckbuilder.help(e.message + ' \n[potential typo at around the card No. ' + i + ' in ' + value + ']');
                            }
                        }
                        // sort the card pool
                        Deckbuilder.cards = Deckbuilder.cards.sort(Deckbuilder.defaultSort);
                        // set current selection to "everything"
                        Deckbuilder.selection = Deckbuilder.cards.slice();
                        // sort selection
                        Deckbuilder.selection = Deckbuilder.selection.sort(Deckbuilder.defaultSort);
                        // set pagecount
                        Deckbuilder.pagecount = Math.ceil(Deckbuilder.selection.length / Deckbuilder.pagelimit);
                        // update number of episodes loaded
                        Deckbuilder.episodes_loaded += 1;
                        // refresh on each update
                        Deckbuilder.selectionAltered = true;
                        Deckbuilder.refresh();
                    }
                };
                xmlHttp.send(null);
            } catch (e) {
                Deckbuilder.help(e.message);
            }
        });
    },

    /**
         * Default Sort method.
         */
    defaultSort: function (a, b) {
        // the index determines order in subsequent logic
        var types = { character: 0, follower: 1, spell: 3, material: 4 };
        var factions = { vita: 0, academy: 1, crux: 2, darklore: 3, sg: 4 };

        // sort by faction
        if (factions[a.faction] == factions[b.faction]) {
            // then sort by type
            if (types[a.type] == types[b.type]) {
                // then sort by episode
                if (a.size == b.size) {
                    // then sort by id (so it's consistent)
                    return a.id - b.id;
                } else // different episodes
                {
                    // then sort by size
                    return a.size - b.size;
                }
            } else // different type
            {
                return types[a.type] - types[b.type];
            }
        } else // different faction
        {
            return factions[a.faction] - factions[b.faction];
        }
    },

    /**
         * Update Preview
         */
    updatepreview: function (cardid) {
        // find card
        var card = Deckbuilder.copyCardById(cardid);
        try {
            Deckbuilder.preview = card;
            // update
            if (card.type == 'follower') {
                $('#preview .preview-cardstats').html('<span class="atk">' + card.stats.atk + '</span><span class="def">' + card.stats.def + '</span><span class="stm">' + card.stats.stm + '</span>');
                $('#preview .preview-cardsize').html(card.size);
                $('#preview #library-add').attr('data-cardid', card.id);
                $('#preview #library-remove').attr('data-cardid', card.id);
                $('#preview .preview-cardstats').show();
                $('#preview .preview-cardsize').show();
                $('#preview .preview-cardcopy-update').show();
            } else if (card.type == 'spell') {
                $('#preview .preview-cardsize').html(card.size);
                $('#preview #library-add').attr('data-cardid', card.id);
                $('#preview #library-remove').attr('data-cardid', card.id);
                $('#preview .preview-cardstats').hide();
                $('#preview .preview-cardsize').show();
                $('#preview .preview-cardcopy-update').show();
            } else if (card.type == 'character') {
                $('#preview .preview-cardstats').html('<span class="life">' + card.life + '</span>');
                $('#preview #library-add').removeAttr('data-cardid');
                $('#preview #library-remove').removeAttr('data-cardid');
                $('#preview .preview-cardsize').hide();
                $('#preview .preview-cardstats').show();
                $('#preview .preview-cardcopy-update').hide();
            } else {
                $('#preview .preview-cardsize').hide();
                $('#preview .preview-cardstats').hide();
                $('#preview .preview-cardcopy-update').hide();
            }

            var cardImg = Deckbuilder.img(hostImage + card.id + 'L.jpg');

            $('#preview .preview-image').attr('src', cardImg);

            $('#preview .preview-image').attr('id', 'previewfaction-' + card.faction);

            var factionImg = Deckbuilder.img('assets/' + card.faction + '.png');

            $('#preview .preview-characterfaction').attr('src', factionImg);
            $('#preview .preview-characterfaction').attr('data-cardid', card.id);
            var cardName = card.name;
            cardName = '<a style="font-weight:bold; color:#22F; text-decoration:none;" href="card.html?id=' + card.id + '" target="_blank">' + cardName + '</a>';
            $('#preview .preview-name').html(cardName);

            var ablty = card.ability;
            ablty = ablty.replace(/\[/g, '<br ><span style="font-weight:normal;">[');
            ablty = ablty.replace(/"<br >/g, '<br >"');
            ablty = ablty.replace(/\]/g, ']</span><br >');
            ablty = ablty.replace(/\/\//g, '<br >//');
            $('#preview .preview-ability').html(ablty);
            $('#preview .preview-text').html(card.text);
            if (card.type == 'follower') {
                $('#preview .preview-info tbody').html(Deckbuilder.templateCardPreview_Follower(card));
            } else if (card.type == 'spell') {
                $('#preview .preview-info tbody').html(Deckbuilder.templateCardPreview_Spell(card));
            } else // character
            {
                $('#preview .preview-info tbody').html(Deckbuilder.templateCardPreview_Character(card));
            }
        } catch (e) {
            Deckbuilder.help('[' + cardid + '] ' + e.message);
        }
    },

    /**
         * Switches character card in deck
         */
    swapCharacter: function (card) {
        Deckbuilder.deck.character = card;
        Deckbuilder.refreshDeck();
    },

    /**
         * Add card to deck. Illegal deck sizes are allowed, however card limits
         * will be enforced.
         */
    addCardToDeck: function (given_card) {
        // does card exist in deck?
        var card = Deckbuilder.getDeckCard(given_card);
        if (card != null) {
            if (card.limit == 0) {
                Deckbuilder.help('Sorry, this card has a limit of 0.');
            } else if (card.copies < card.limit) {
                ++card.copies;
                Deckbuilder.refreshDeck();
            } else // already maximum
            {
                Deckbuilder.help('You already have ' + card.copies + '/' + card.limit);
            }
        } else // no card yet
        {
            if (given_card.limit == 0) {
                Deckbuilder.help('Sorry, this card has a limit of 0.');
            } else // acceptable
            {
                var card = $.extend(true, {}, given_card);
                card.copies = 1;
                Deckbuilder.deck.cards.push(card);
                Deckbuilder.refreshDeck();
            }
        }
    },

    /**
         * Refreshes the deck view
         */
    refreshDeck: function () {
        // deck name / status
        if (Deckbuilder.lock) {
            $('#options .options-name').html('<strong>Locked</strong> Deck');
        } else if (Deckbuilder.current_save == null) {
            $('#options .options-name').html('<em>Anonymous Deck</em>');
        }
        // re-sort deck
        //Deckbuilder.deck.cards.sort(Deckbuilder.deck.sortOrder);
        Deckbuilder.deck.cards.sort(Deckbuilder.deck.sortOrder || Deckbuilder.typeSort);
        // display character
        var character = Deckbuilder.deck.character;
        var serial = '';
        var showcaseserial = '';
        var points = 0;

        if (character != null) {
            $('#character').show();
            serial += character.id;
            showcaseserial += character.id;
            points += character.CP;

            var cardImg = Deckbuilder.img(hostImage + character.id + 'L.jpg');

            $('#character .character-image').attr('src', cardImg);
            $('#character .character-faction').attr('src', Deckbuilder.img('assets/' + character.faction + '.png'));
            $('#character .character-faction').attr('data-cardid', character.id);
            $('#character .character-name-link').text(character.name);
            $('#character .character-name-link').attr('href', 'card.html?id=' + character.id);
            $('#character .character-name').attr('data-cardid', character.id);
            $('#character .character-ability').text(character.ability);
            $('#character .character-lifecount').text(character.life);
            $('#character .character-pointcount').text(character.CP);
        } else // hide character (cases of clear)
        {
            $('#character').hide();
        }
        serial += 'D';
        showcaseserial += 'D'; // display deck
        $('#cardlist tbody').empty();
        var deck = Deckbuilder.deck.cards;
        var spells = 0;
        var followers = 0;
        for (var i = 0; i < deck.length; ++i) {
            points += deck[i].CP * deck[i].copies;
            spells += deck[i].type == 'spell' ? deck[i].copies : 0;
            followers += deck[i].type == 'follower' ? deck[i].copies : 0;
            serial += deck[i].copies + 'P' + deck[i].id + 'C';
            $('#cardlist tbody').append(Deckbuilder.templateCardlistCard(deck[i]));
        }
        // copy deck
        var deckcopy = Deckbuilder.deck.cards.slice();
        // reorder copy
        deckcopy.sort(function (a, b) {
            if (a.type == b.type) {
                if (a.size == b.size) {
                    // gurantee consistency
                    return b.id - a.id;
                } else // different sizes
                {
                    return b.size - a.size;
                }
            } else // different types
            {
                if (a.type == 'follower') {
                    return -1;
                } else // a.type == 'spell'
                {
                    return +1;
                }
            }
        });
        // build constant serial for showcase
        for (var i = 0; i < deckcopy.length; ++i) {
            showcaseserial += deckcopy[i].copies + 'P' + deckcopy[i].id + 'C';
        }
        Deckbuilder.showcaseserial = showcaseserial;
        // bind selection event to all cards
        $('#cardlist .cardlist-card .card-thumbnail').click(Deckbuilder.deckCardclickEvent);
        $('#cardlist .cardlist-card .card-copies').click(function () {
            clearSelection();
            var card = Deckbuilder.getDeckCardById($(this).attr('date-cardid'));
            if (card.copies != card.limit) {
                card.copies += 1;
            } else // already have all
            {
                Deckbuilder.help('You already have ' + card.copies + '/' + card.limit);
            }
            Deckbuilder.refreshDeck();
            return false;
        });
        // bind preview event to all cards
        $('#cardlist .cardlist-card .card-name').click(function (event) {
            event.preventDefault();
            Deckbuilder.updatepreview($(this).attr('data-cardid'));
            return false;
        });
        // make unselectable
        $('#cardlist .cardlist-card .card-thumbnail').mousedown(function () { return false; }); // compute deck spell count
        $('#analysis .analysis-pointcount').text(points);
        $('#analysis .analysis-spellcount').text(spells);
        $('#analysis .analysis-followercount').text(followers);
        $('#analysis .analysis-cardcount').text(followers + spells);
        // compute serial; will potentially make the string a little bigger
        // then the uncompressed version on some cases, but overall not an issue
        // browsers should be able to safely handle 2000 characters and the
        // typically length here should be around 170 on more simple decks and
        // not go up much from there.
        if (Deckbuilder.options.compression) {
            serial = encodeURIComponent(Base64.encode(LZW.encode(serial)));
        }
        Deckbuilder.serial = serial;
        $('#options .options-permalink').attr('href', Deckbuilder.options.page_baseurl + '?deck=' + serial + '&compression=' + Deckbuilder.options.compression);
        // name?
        if (Deckbuilder.current_save != null) {
            $.cookies.set('deckname', Deckbuilder.current_save);
        } else // no save, better clean up!
        {
            $.cookies.del('deckname');
        }
        // store serial
        $.cookies.set('serial', serial);
        if (Deckbuilder.current_save != null) {
            // find save
            for (var i = 0; i < Deckbuilder.saves.length; ++i) {
                if (Deckbuilder.saves[i].id == Deckbuilder.current_save) {
                    Deckbuilder.lock = false;
                    $('#options .options-name').html(Deckbuilder.saves[i].name);
                    Deckbuilder.saves[i].serial = serial;
                    Deckbuilder.saves[i].compression = Deckbuilder.options.compression;
                    Deckbuilder.updateLocalStorage();
                    break;
                }
            }
        }
        // check deck validity
        if (character == null || followers + spells != 30) {
            // invalid deck
            if (followers + spells > 30) {
                $('#options .options-notice').text('Invalid Deck');
                $('#options .options-notice').show();
            } else // no need to nag about it
            {
                // say nothing
                $('#options .options-notice').hide();
            }
            // hide showcase link
            $('#sorting .sorting-showcase').html('<s>Showcase</s>'); // hide test link
            $('#sorting .sorting-view').html('<s>Analyze</s>');
        } else // valid deck
        {
            // hide any notice
            $('#options .options-notice').hide();
            // display showcase link
            $('#sorting .sorting-showcase').html('<a href="showcase.html?deck=' + Deckbuilder.showcaseserial + '" target="_blank">Showcase</a>');
            // display test link
            $('#sorting .sorting-view').html('<a href="#" id="DeckViewer">Analyze</a>');
        }
    },

    /**
         * Get's deck version of the card, by id.
         */
    getDeckCardById: function (id) {
        var deck = Deckbuilder.deck.cards;
        var foundcard = null;
        for (var i = 0; i < deck.length; ++i) {
            if (id == deck[i].id) {
                foundcard = deck[i];
                break;
            }
        }

        return foundcard;
    },

    /**
         * Get's deck version of the card.
         */
    getDeckCard: function (card) {
        return Deckbuilder.getDeckCardById(card.id);
    },

    /**
         * Retrieve card.
         */
    copyCardById: function (id) {
        for (var i = 0; i < Deckbuilder.cards.length; ++i) {
            if (Deckbuilder.cards[i].id == id) {
                return $.extend(true, {}, Deckbuilder.cards[i]);
            }
        }

        return null;
    },

    /**
         * Event when a card in the collection is click.
         * First click = select
         * Second click = add to deck (if limit not reached)
         */
    cardclickEvent: function () {
        clearSelection();
        if (Deckbuilder.selectedcard !== null) {
            Deckbuilder.selectedcard.css('border-color', '#d79132');
            // same card as before?
            if (Deckbuilder.selectedcard.attr('data-cardid') == $(this).attr('data-cardid')) {
                if (!Deckbuilder.lock) {
                    // same card, register click as deck manipulation
                    // retrieve card
                    var card = Deckbuilder.copyCardById($(this).attr('data-cardid'));
                    // check if character
                    if (card.type == 'character') {
                        Deckbuilder.swapCharacter(card);
                    } else // non-character, goes in deck
                    {
                        Deckbuilder.addCardToDeck(card);
                    }
                } else // deck is locked!
                {
                    Deckbuilder.help('You are viewing a Locked Deck. Save the deck first to start editing.');
                }
            }
        }

        Deckbuilder.selectedcard = $(this);
        $(this).css('border-color', 'blue');
        Deckbuilder.updatepreview($(this).attr('data-cardid'));
    },

    /**
         * Event when card is clicked in deck; remove 1 copy.
         */
    deckCardclickEvent: function (event) {
        clearSelection();
        // find card in deck
        var card = Deckbuilder.getDeckCardById($(this).attr('date-index'));
        card.copies -= 1;
        if (card.copies == 0) {
            // remove card
            var deck = Deckbuilder.deck.cards;
            for (var i = 0; i < deck.length; ++i) {
                if (deck[i].id == card.id) {
                    deck.splice(i, 1);
                    break;
                }
            }
        }
        Deckbuilder.refreshDeck();
    },

    /**
         * Save deck with given name.
         */
    saveDeckAs: function (savename) {
        var new_id = (new Date()).valueOf() + '';
        Deckbuilder.saves.push({
            name: savename,
            id: new_id,
            serial: Deckbuilder.serial,
            compression: Deckbuilder.options.compression,
        });
        Deckbuilder.updateLocalStorage();
        Deckbuilder.current_save = new_id;
        Deckbuilder.refreshDeck();
        Deckbuilder.help('Deck saved as ' + savename);
    },

    /**
         * Saves current library of cards, for future reference in cardlist.
         */
    saveLibrary: function () {
        if (Deckbuilder.library_ids.length > 0) {
            var cardcount = Deckbuilder.library[Deckbuilder.library_ids[0]];
            var saveString = Deckbuilder.library_ids[0] + 'x' + cardcount;
            for (var i = 1; i < Deckbuilder.library_ids.length; ++i) {
                cardcount = Deckbuilder.library[Deckbuilder.library_ids[i]];
                saveString += ';' + Deckbuilder.library_ids[i] + 'x' + cardcount;
            }
            localStorage.library = saveString;
        } else // no saves
        {
            localStorage.library = '';
        }
    },

    /**
         * Loads library of cards.
         */
    loadLibrary: function () {
        var saveString = localStorage.library;
        if (saveString != undefined && saveString != '') {
            var saves = saveString.split(';');
            for (var i = 0; i < saves.length; ++i) {
                var id_copies = saves[i].split('x');
                var id = parseInt(id_copies[0]);
                Deckbuilder.library_ids.push(id);
                Deckbuilder.library[id] = parseInt(id_copies[1]);
            }
        }
    },

    /**
         * Serializes our stuff
         */
    updateLocalStorage: function () {
        if (Deckbuilder.saves.length > 0) {
            var save = Deckbuilder.saves[0];
            var saveString = save.id + ':-localStorage-DIV2-Deckbuilder-:' + save.name + ':-localStorage-DIV2-Deckbuilder-:' + save.serial + ':-localStorage-DIV2-Deckbuilder-:' + save.compression;
            for (var i = 1; i < Deckbuilder.saves.length; ++i) {
                save = Deckbuilder.saves[i];
                saveString += ':-localStorage-DIV1-Deckbuilder-:' +
                    save.id + ':-localStorage-DIV2-Deckbuilder-:' +
                    save.name + ':-localStorage-DIV2-Deckbuilder-:' +
                    save.serial + ':-localStorage-DIV2-Deckbuilder-:' +
                    save.compression;
            }
            localStorage.saves = saveString;
        } else // no saves
        {
            localStorage.saves = '';
        }
    },

    /**
         * Unserializes our stuff
         */
    restoreLocalStorage: function () {
        var saveString = localStorage.saves;
        if (saveString != undefined && saveString != '') {
            var saves = saveString.split(':-localStorage-DIV1-Deckbuilder-:');
            for (var i = 0; i < saves.length; ++i) {
                var obj = saves[i].split(':-localStorage-DIV2-Deckbuilder-:');
                saves[i] = { id: obj[0], name: obj[1], serial: obj[2], compression: parseBool(obj[3]) };
            }
            Deckbuilder.saves = saves;
        }
    },

    /**
         * Encodes a list to a URI friendly format
         */
    encodeURIList: function (list) {
        var output = '';
        if (list != null) {
            if (list.length > 0) {
                output += list[0];
                for (var i = 1; i < list.length; ++i) {
                    output += ',' + list[i];
                }
            }
        }

        return encodeURIComponent(output);
    },

    /**
         * Decodes a list passed by uri
         */
    decodeURIList: function (urilist) {
        var list = [];
        var temp_list = decodeURIComponent(urilist).split(',');
        if (temp_list.length > 0 && temp_list[0] != '') {
            for (var i = 0; i < temp_list.length; ++i) {
                list.push(decodeURIComponent(temp_list[i]));
            }
        }
        return list;
    },

    /**
         * Loads the deck using the serial.
         */
    loadDeckUsingSerial: function (serial, compression) {
        // reset all
        Deckbuilder.deck.character = null;
        Deckbuilder.deck.cards = [];
        // load new
        var serialString;
        if (compression) {
            // unpack
            serialString = LZW.decode(Base64.decode(decodeURIComponent(serial)));
        } else // no compression
        {
            serialString = serial;
        }
        // get character
        var char_and_deck = serialString.split('D');
        if (char_and_deck[0] != '' && char_and_deck[0] != undefined) {
            Deckbuilder.swapCharacter(Deckbuilder.copyCardById(char_and_deck[0]));
        }
        // build rest of deck
        if (char_and_deck[1] != '' && char_and_deck[1] != undefined) {
            // card list
            var cardlist = char_and_deck[1].split('C');
            // last ; produces undefined so we skip that one
            for (var j = 0; j < cardlist.length - 1; ++j) {
                var copies_and_card = cardlist[j].split('P');
                var card = Deckbuilder.copyCardById(copies_and_card[1]);
                if (card != null) {
                    card.copies = parseInt(copies_and_card[0]);
                    Deckbuilder.deck.cards.push(card);
                } else // card was invalid
                {
                    Deckbuilder.help('Failed to load card with id [' + copies_and_card[1] + '] skipping...');
                }
            }
        }
        Deckbuilder.refreshDeck();
    },

    /**
         * Generates function for equation variable
         */
    equationVariable: function (equation, refs) {
        equation = equation.trim();
        // got a variable
        if (equation.indexOf('@') == 0) {
            // string reference
            return function (card) { return refs.str[parseInt(equation.substr(1))] };
        } else if (equation.indexOf('#') == 0) {
            // paranthesis (inner equation)
            return Deckbuilder.compileEquation(refs.para[parseInt(equation.substr(1))], refs);
        } else if (equation.indexOf('!') == 0) {
            // negation
            var subformula = Deckbuilder.compileEquation(equation.substr(1));
            return function (card) { return !subformula(card); };
        } else if (equation == 'faction') {
            return function (card) { return card.faction; };
        } else if (equation == 'limit') {
            return function (card) { return card.limit; };
        } else if (equation == 'isvita') {
            return function (card) { return card.faction == 'vita'; };
        } else if (equation == 'isacademy') {
            return function (card) { return card.faction == 'academy'; };
        } else if (equation == 'iscrux') {
            return function (card) { return card.faction == 'crux'; };
        } else if (equation == 'isdl') {
            return function (card) { return card.faction == 'darklore'; };
        } else if (equation == 'issg') {
            return function (card) { return card.faction == 'sg'; };
        } else if (equation == 'id') {
            return function (card) { return card.id; };
        } else if (equation == 'name') {
            return function (card) { return card.name; };
        } else if (equation == 'cp') {
            return function (card) { return card.CP; };
        } else if (equation == 'lmt') {
            return function (card) { return card.limit; };
        } else if (equation == 'size') {
            return function (card) { return card.size; };
        } else if (equation == 'atk') {
            return function (card) { return card.stats != undefined ? card.stats.atk : 0; };
        } else if (equation == 'def') {
            return function (card) { return card.stats != undefined ? card.stats.def : 0; };
        } else if (equation == 'stm' || equation == 'sta') {
            return function (card) { return card.stats != undefined ? card.stats.stm : 0; };
        } else if (equation == 'hasability') {
            return function (card) { return card.ability != ''; };
        } else if (equation == 'isflw') {
            return function (card) { return card.type == 'follower'; };
        } else if (equation == 'isspell') {
            return function (card) { return card.type == 'spell'; };
        } else if (equation == 'ischar') {
            return function (card) { return card.type == 'character'; };
        } else if (equation.match(/[0-9]+/)) {
            return function (card) { return parseInt(equation); };
        } else // assume string
        {
            return function (card) { return equation; };
        }
    },

    /**
         * Generates equation function based on string version of the equation.
         */
    compileEquation: function (equation, refs) {
        // defaults
        if (refs == undefined || refs == null) {
            refs = { str: [], para: [] };
        }
        equation = equation.trim();
        // reference any strings
        var strings = /(\"[^\"]*\")/g;
        var match = strings.exec(equation);
        if (match != null) {
            do {
                refs.str.push(match[1].substr(1, match[1].length - 2));
                equation = equation.replace(match[1], '@' + (refs.str.length - 1));
                match = strings.exec(equation);
            } while (match != null);
        }
        strings = /(\'[^\']*\')/g;
        match = strings.exec(equation);
        if (match != null) {
            do {
                refs.str.push(match[1].substr(1, match[1].length - 2));
                equation = equation.replace(match[1], '@' + (refs.str.length - 1));
                match = strings.exec(equation);
            } while (match != null);
        }
        // reference any paranthesis
        var para = /(\(.*\))[^\)]*$/g;
        match = para.exec(equation);
        if (match != null) {
            do {
                refs.para.push(match[1].substr(1, match[1].length - 2));
                equation = equation.replace(match[1], '#' + (refs.para.length - 1));
                match = strings.exec(equation);
            } while (match != null);
        }

        // var tokenRegex = /^(.*)(\+|-|\/|\*|==|<=|>=|<|>|\|\||\&\&|\!|=~)([^\+-\/\*\|\&\!=<>~]+)$/g;
        var tokenRegex = /^(.*)(\|\||\&\&)([^\|\&]+)$/g;
        match = tokenRegex.exec(equation);
        var token;
        var first;
        var second;
        if (match == null) {
            tokenRegex = /^(.*)(==|<=|>=|=\~|>|<)([^=><~]+)$/g;
            match = tokenRegex.exec(equation);
            if (match == null) {
                tokenRegex = /^(.*)(\+|-)([^\+-]+)$/g;
                match = tokenRegex.exec(equation);
                if (match == null) {
                    tokenRegex = /^(.*)(\/|\*)([^\/\*]+)$/g;
                    match = tokenRegex.exec(equation);
                    if (match == null) {
                        return Deckbuilder.equationVariable(equation, refs);
                    } else // got operator
                    {
                        token = match[2].trim();
                        first = Deckbuilder.compileEquation(match[1].trim(), refs);
                        second = Deckbuilder.compileEquation(match[3].trim(), refs);
                        if (token == '*') {
                            return function (card) { return parseInt(first(card) * second(card)) };
                        } else if (token == '/') {
                            return function (card) { return first(card) / second(card); };
                        } else {
                            return function (card) { return 0; };
                        }
                    }
                } else // got operator
                {
                    token = match[2].trim();
                    first = Deckbuilder.compileEquation(match[1].trim(), refs);
                    second = Deckbuilder.compileEquation(match[3].trim(), refs);
                    if (token == '+') {
                        return function (card) { return first(card) + second(card); };
                    } else if (token == '-') {
                        return function (card) { return first(card) - second(card); };
                    } else {
                        return function () { return 0; };
                    }
                }
            } else // got operator
            {
                token = match[2].trim();
                first = Deckbuilder.compileEquation(match[1].trim(), refs);
                second = Deckbuilder.compileEquation(match[3].trim(), refs);
                if (token == '==') {
                    return function (card) { return first(card) == second(card); };
                } else if (token == '<=') {
                    return function (card) { return first(card) <= second(card); };
                } else if (token == '>=') {
                    return function (card) { return first(card) >= second(card); };
                } else if (token == '>') {
                    return function (card) { return first(card) > second(card); };
                } else if (token == '<') {
                    return function (card) { return first(card) < second(card); };
                } else if (token == '=~') {
                    return function (card) { return ('' + first(card)).toLowerCase().indexOf(('' + second(card)).toLowerCase()) != -1; };
                } else {
                    return function (card) { return true; };
                }
            }
        } else // got || or &&
        {
            token = match[2].trim();
            first = Deckbuilder.compileEquation(match[1].trim(), refs);
            second = Deckbuilder.compileEquation(match[3].trim(), refs);
            if (token == '&&') {
                return function (card) { return first(card) && second(card); };
            } else if (token == '||') {
                return function (card) { return first(card) || second(card); };
            } else {
                return function (card) { return true; };
            }
        }
    },

    /**
         * Redraws all elements on screen.
         */
    refresh: function () {
        // all loaded?
        if (Deckbuilder.episodes_loaded != Deckbuilder.episodes.length)
            return;

        // run one time stuff
        var random_card;
        if (Deckbuilder.init) {
            // banners
            do {
                random_card = Deckbuilder.cards[(Math.floor(Math.random() * Deckbuilder.cards.length))];
            } while ((random_card.CP < 3 && random_card.type == 'follower') ||
            random_card.type == 'material' ||
                (random_card.type == 'character' && random_card.CP < 20));

            $('#linkswindow .mainsite-link')
                .attr({ "href": "card.html?id=" + random_card.id, title: random_card.name });
            $('#linkswindow .mainsite-link img').attr({ 'src': Deckbuilder.img(hostImage + random_card.id + 'L.jpg'), alt: random_card.name });

            Deckbuilder.init = false;
            // info
            $('#dbinfo').html(Deckbuilder.cards.length + ' cards. v' + Deckbuilder.version + 'r' + Deckbuilder.revision);
            // Pager Next
            $('#collection-controls .controls-pager .pager-next').click(function (event) {
                if ($(this).attr('disabled') !== 'disabled') {
                    Deckbuilder.page += 1;
                    Deckbuilder.selectionAltered = true;
                    Deckbuilder.refresh();
                }
                return false;
            });
            // Pager Prev
            $('#collection-controls .controls-pager .pager-prev').click(function (event) {
                if ($(this).attr('disabled') !== 'disabled') {
                    Deckbuilder.page -= 1;
                    Deckbuilder.selectionAltered = true;
                    Deckbuilder.refresh();
                }
                return false;
            });
            // Page Limit
            $('#collection-controls .controls-pager .pager-pagelimit').change(function (event) {
                Deckbuilder.pagelimit = $(this).val();
                $.cookies.set('pagelimit', $(this).val());
                Deckbuilder.selectionAltered = true;
                Deckbuilder.refresh();
                return false;
            });
            // saved pagelimit?
            var pagelimit = $.cookies.get('pagelimit');
            if (pagelimit != null) {
                Deckbuilder.pagelimit = pagelimit;
                $('#collection-controls .pager-pagelimit').attr('value', pagelimit);
            }
            // cardfaction linking
            $('#cardlist .card-faction img').on('click', function (event) {
                window.open('card.html?id=' + $(this).attr('data-cardid'));
            });
            $('#preview .preview-characterfaction').on('click', function (event) {
                window.open('card.html?id=' + $(this).attr('data-cardid'));
            });
            $('#collection .card-faction').on('click', function (event) {
                window.open('card.html?id=' + $(this).attr('data-cardid'));
            });
            $('#character .character-faction').on('click', function (event) {
                window.open('card.html?id=' + $(this).attr('data-cardid'));
            });
            $('#character .character-name').on('click', function (event) {
                event.preventDefault();
                Deckbuilder.updatepreview($(this).attr('data-cardid'));
            });

            Deckbuilder.loaddialog = $('<div></div>')
                .html('<ul id="loaddialog-saves"></ul>')
                .dialog({
                    autoOpen: false,
                    title: 'Load Deck'
                });

            // check cookies
            var deckparam = getParameterByName('deck');
            var deckname = null;
            var serial;
            if (deckparam != '') {
                Deckbuilder.lock = true;
                serial = deckparam;
                var deckcompression = getParameterByName('compression');
                if (deckcompression != '') {
                    Deckbuilder.options.compression = parseBool(deckcompression);
                }
            } else // try cookies
            {
                serial = $.cookies.get('serial');
                deckname = $.cookies.get('deckname');
            }

            if (deckname != null) {
                Deckbuilder.current_save = deckname;
            }

            if (serial != null) {
                Deckbuilder.loadDeckUsingSerial(serial, Deckbuilder.options.compression);
            }
        }

        if (Deckbuilder.selectionAltered) {
            Deckbuilder.selection = Deckbuilder.cards.slice();
            if (Deckbuilder.filter != '') {
                if (Deckbuilder.filter[0] == '=') {
                    // equation
                    var equation = Deckbuilder.compileEquation(Deckbuilder.filter.substring(1).toLowerCase());
                    Deckbuilder.selection = Deckbuilder.selection.filter(equation);
                } else // normal filter
                {
                    Deckbuilder.selection = Deckbuilder.selection.filter(function (e) {
                        return e.name.toLowerCase().indexOf(Deckbuilder.filter.toLowerCase()) != -1 ||
                            e.ability.toLowerCase().indexOf(Deckbuilder.filter.toLowerCase()) != -1 ||
                            e.artist.toLowerCase().indexOf(Deckbuilder.filter.toLowerCase()) != -1 ||
                            e.krname.indexOf(Deckbuilder.filter.toLowerCase()) != -1 ||
                            e.text.toLowerCase().indexOf(Deckbuilder.filter.toLowerCase()) != -1 ||
                            e.id == ('' + Deckbuilder.filter);
                    });
                }
            }

            var rarity = $('#collection-controls .controls-rarity').val();
            var episodes = $('#collection-controls .controls-episode').val();
            var sizes = $('#collection-controls .controls-size').val();
            var types = $('#collection-controls .controls-type').val();
            var factions = $('#collection-controls .controls-faction').val();
            var archetypes = $('#collection-controls .controls-archetype').val();

            // setup using selects
            Deckbuilder.selection = Deckbuilder.selection.filter(function (e) {
                if ($.inArray(e.type, types) == -1)
                    return false;

                if ($.inArray(e.episode, episodes) == -1)
                    return false;

                if (!e.playable && $.inArray('npc', types) == -1)
                    return false;

                if (e.type == 'material')
                    return true; // skip other tests

                if (e.type != 'character' && $.inArray(e.size + '', sizes) == -1)
                    return false;

                if ($.inArray(e.rarity, rarity) == -1)
                    return false;

                if ($.inArray(e.faction, factions) == -1)
                    return false;

                if (e.type != 'character' && $.inArray(e.archetype, archetypes) == -1)
                    return false;

                return true;
            });
            Deckbuilder.selection = Deckbuilder.selection.sort(Deckbuilder.defaultSort);

            // update collection selection url
            var filter = encodeURIComponent(Deckbuilder.filter);
            rarity = Deckbuilder.encodeURIList(rarity);
            episodes = Deckbuilder.encodeURIList(episodes);
            sizes = Deckbuilder.encodeURIList(sizes);
            types = Deckbuilder.encodeURIList(types);
            factions = Deckbuilder.encodeURIList(factions);
            archetypes = Deckbuilder.encodeURIList(archetypes);
            $('#collection_selection').attr('href', Deckbuilder.options.page_baseurl + '?filter=' + filter + '&rarity=' + rarity + '&episodes=' + episodes + '&sizes=' + sizes + '&types=' + types + '&factions=' + factions + '&archetypes=' + archetypes); // setup preview; if void
            if (Deckbuilder.preview === null && Deckbuilder.selection.length > 0) {
                do {
                    random_card = Deckbuilder.cards[(Math.floor(Math.random() * Deckbuilder.cards.length))];
                } while (random_card.type == 'material' || random_card.playable == false);
                Deckbuilder.updatepreview(random_card.id);
            }
            // pager setup
            Deckbuilder.pagecount = Math.ceil(Deckbuilder.selection.length / Deckbuilder.pagelimit);
            if (Deckbuilder.page > Deckbuilder.pagecount) {
                Deckbuilder.page = Deckbuilder.pagecount;
            }
            if (Deckbuilder.page < 1) {
                Deckbuilder.page = 1;
            }
            $('#collection-controls .controls-page').text(this.page);
            $('#collection-controls .controls-pagecount').text(this.pagecount);
            if (this.page == this.pagecount) {
                $('#collection-controls .pager-next').attr('disabled', 'disabled');
            } else // not last page, gurantee it's enabled
            {
                $('#collection-controls .pager-next').removeAttr('disabled');
            }
            if (this.page == 1) {
                $('#collection-controls .pager-prev').attr('disabled', 'disabled');
            } else // not last page, gurantee it's enabled
            {
                $('#collection-controls .pager-prev').removeAttr('disabled');
            }
            // clear card table
            $('#collection').empty();
            // add cards based on page and sorting
            for (var i = this.pagelimit * (this.page - 1); i < this.pagelimit * this.page && i < this.selection.length; ++i) {
                var card = this.selection[i];
                if (card.type == 'follower') {
                    $('#collection').append(Deckbuilder.templateCollectionCard_Follower(card));
                } else if (card.type == 'spell') {
                    $('#collection').append(Deckbuilder.templateCollectionCard_Spell(card));
                } else if (card.type == 'character') {
                    $('#collection').append(Deckbuilder.templateCollectionCard_Character(card));
                } else // material
                {
                    $('#collection').append(Deckbuilder.templateCollectionCard_Material(card));
                }
            }
            // bind selection event to all cards
            $('#collection .collection-card .card-image').click(Deckbuilder.cardclickEvent);
            // make unselectable
            $('#collection .collection-card .card-image').mousedown(function () {
                return false;
            }); // prevent reprocessing
            Deckbuilder.selectionAltered = false;
        }
    }
};

$(document).ready(function () {
    $.ajax({
        url: 'data/SwordGirlData.json',
        dataType: "json",
        success: function(data) {
            if (!data || !data.cards) {
                return;
            }

            DeckInit(data.cards);
        },
        error: function(err) {
            $('.message').html('Could not load data');
            $('.message').show();

            console.error(err);
        }
});

    //Deckbuilder.help('Tip: Click cards to view and add. Click cards again in deck to remove. Have fun! :)');

    // options binding
    $('#options .options-clear').on('click', function () {
        Deckbuilder.deck.character = null;
        Deckbuilder.deck.cards = [];
        Deckbuilder.current_save = null;
        Deckbuilder.refreshDeck();
        return false;
    });

    $('#options .options-save').on('click', function () {
        var name = prompt('Save deck as...');
        if (name != '' && name != null) {
            Deckbuilder.saveDeckAs(name);
        }
        return false;
    });

    $('#options .options-load').on('click', function () {
        Deckbuilder.loaddialog.dialog('open');
        // populate
        $('#loaddialog-saves').empty();
        var saves = Deckbuilder.saves;
        for (var i = 0; i < saves.length; ++i) {
            $('#loaddialog-saves').append(Deckbuilder.templateDeckLoadWindow(i, saves));
        }

        $("#loaddialog-saves").sortable({
            deactivate: function () {
                var list = $('li', this);
                if (list.length == Deckbuilder.saves.length) {
                    var idx_list = [];
                    var i;
                    for (i = 0; i < list.length; ++i) {
                        idx_list.push(parseInt($(list[i]).attr('data-idx')));
                    }
                    var new_save_order = [];
                    for (i = 0; i < idx_list.length; ++i) {
                        new_save_order.push(Deckbuilder.saves[idx_list[i]]);
                    }
                    Deckbuilder.saves = new_save_order;
                    Deckbuilder.updateLocalStorage();
                }
            }
        });

        return false;
    });

    $(document).on('click', '#loaddialog-saves .saves-del', function (event) {
        var id = $(this).attr('data-id');
        var i;
        for (i = 0; i < Deckbuilder.saves.length; ++i) {
            if (Deckbuilder.saves[i].id == id) {
                Deckbuilder.saves.splice(i, 1);
                Deckbuilder.updateLocalStorage();
                // re-populate
                $('#loaddialog-saves').empty();
                var saves = Deckbuilder.saves;
                for (i = 0; i < saves.length; ++i) {
                    $('#loaddialog-saves').append(Deckbuilder.templateDeckLoadWindow(i, saves));
                }
                if (id == Deckbuilder.current_save) {
                    Deckbuilder.current_save = null;
                    Deckbuilder.refreshDeck();
                }
                return false;
            }
        }
        return false;
    });

    $(document).on('click', '#loaddialog-saves .saves-edit', function () {
        var id = $(this).attr('data-id');
        var i;
        for (i = 0; i < Deckbuilder.saves.length; ++i) {
            if (Deckbuilder.saves[i].id == id) {
                var newname = prompt('New Name', Deckbuilder.saves[i].name);
                if (newname != null && newname != '') {
                    Deckbuilder.saves[i].name = newname;
                    Deckbuilder.updateLocalStorage();
                }
                // re-populate
                $('#loaddialog-saves').empty();
                var saves = Deckbuilder.saves;
                for (i = 0; i < saves.length; ++i) {
                    $('#loaddialog-saves').append(Deckbuilder.templateDeckLoadWindow(i, saves));
                }
                Deckbuilder.refreshDeck();
                return false;
            }
        }
        return false;
    });
});

function DeckInit(dataCards) {
    // bootstrap
            Deckbuilder.bootstrap({
                // base url for the page
                page_baseurl: location.hostname,

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
                episodes: ['0', '1', '2', '3', 'EX1', '4', '5', '6', 'EX2', '7', 'M', 'UE1', '8', 'EX3', '9', '10', 'UE2', '11', '12', '13', 'EX4', '14', '15', '16', 'UE3', 'EX5', '17', 'UE4', '18', 'EX6', '19', 'UE5', '20'], // Array
                defaultEpisodes: ['0', '1'],
                // [!!] required even when statics are set since it's used
                // for interface features

                // Releases
                // Overwrites any release information when set
                releases: {
                    episodes: ['0', '1', '2', '3', 'EX1', '4', '5', '6', 'EX2', '7', 'M', 'UE1', '8', 'EX3', '9', '10', 'UE2', '11', '12', '13', 'EX4', '14', '15', '16', 'UE3', 'EX5', '17', 'UE4', '18', 'EX6', '19'], // Array
                    cards: [100089, 210030, 210031, 210032]
                },

                // Card sizes
                sizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Array

                // Rarity
                rarity: ['Common', 'Uncommon', 'Rare', 'D.Rare', 'T.Rare', 'Event', 'Prize', 'Imperial'], // Array
                defaultRarity: ['Rare', 'D.Rare'],
                //defaultRarity: 'null',

                // Factions
                factions: ['Vita', 'Academy', 'Crux', 'Darklore', 'SG', 'Empire'], // Array

                // --- Static Options --------------------------------------
                // the following are meant for creating self contained
                // versions of the application.

                // Static versions of the episodes. Note you can generate
                // monolith files with out worrying too much, just make sure
                // to set the episode since there are no files to guess it
                statics: dataCards, // null|Array
                // [!!] overwrites episodes as loading mechanism

                // Base64 encodes of all assets (the core assets, specified
                // in CSS, etc should be picked up automatically so no need
                // for those; some are already base64 there anyway). Pretty
                // much all (known) browsers support them, since the
                // operation is so basic. And those that don't don't matter;
                // since they couldn't open .mht anyway =P (mht = base64 of
                // everything to begin with). The application will use the
                // base64 encoded version of the image instead of computing
                // an url for the src attribute on images
                datastream: null // Loader.datastream, // null|Array
                // format: { 'usual/url/part': 'data:image/jpeg;base64,iVBORw0KGgoA...' }
            });
}