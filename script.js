(function() {
    var currentPlayer = "player1";
    var victoryDialog = $("#victory");
    var cool = $("#cool");
    var darken = $("#darken");
    var frameHolder = $(".frameHolder");
    var updatePlayer = $(".updatePlayer");
    var allColumns = $(".column");
    var chooseFirst = $(".chooseFirst");
    var chooseSecond = $(".chooseSecond");
    var disclaimerBtn = $(".disclaimerBtn");
    var disclaimer = $(".disclaimer");
    var avatar;
    var avatar2;
    var button = $(".changePlayer");
    var killText = $(".killText");
    var fall = $(".fall");
    var ok = $(".ok");
    setTimeout(show, 1000);

    function show() {
        chooseFirst.addClass("on");
        darken.addClass("on");
    }

    function showDisclaimer() {
        disclaimer.addClass("on");
        darken.addClass("on");
    }

    $(".first").on("click", function(event) {
        avatar = event.target.src;
        chooseFirst.removeClass("on");
        chooseSecond.addClass("on");
    });

    $(".second").on("click", function(event) {
        avatar2 = event.target.src;
        chooseSecond.removeClass("on");
        darken.removeClass("on");
    });

    button.on("click", function() {
        clear();
        show();
    });

    disclaimerBtn.on("click", function() {
        showDisclaimer();
    });

    ok.on("click", function() {
        disclaimer.removeClass("on");
        darken.removeClass("on");
    });

    killText.on("click", function() {
        frameHolder.empty();
    });

    $(".column").on("click", function(event) {
        var columnIndex = $(event.currentTarget).index();
        var slotsinColumn = $(event.currentTarget).find(".slot");

        for (var i = 5; i >= 0; i--) {
            var slotinColumn = slotsinColumn.eq(i);
            if (
                !slotinColumn.hasClass("player1") &&
                !slotinColumn.hasClass("player2")
            ) {
                slotinColumn.addClass(currentPlayer);
                if (currentPlayer == "player1") {
                    slotinColumn.find(".hole").css({
                        "background-image": "url('" + avatar + "')",
                        "background-size": "cover"
                    });
                } else {
                    slotinColumn.find(".hole").css({
                        "background-image": "url('" + avatar2 + "')",
                        "background-size": "cover"
                    });
                }
                break;
            }
        }
        if (i == -1) {
            return;
        }

        if (checkForVictory(slotsinColumn)) {
            victory();
        } else if (checkForVictory($(".row" + i))) {
            victory();
        } else if (checkRight(i, columnIndex)) {
            victory();
        } else if (checkLeft(i, columnIndex)) {
            victory();
        } else {
            switchPlayer();
            return;
        }
    });

    function switchPlayer() {
        if (currentPlayer == "player1") {
            currentPlayer = "player2";
        } else {
            currentPlayer = "player1";
        }
    }

    function checkForVictory(slots) {
        var str = "";
        for (var i = 0; i < slots.length; i++) {
            if (slots.eq(i).hasClass(currentPlayer)) {
                str += "o";
            } else {
                str += "x";
            }
        }
        return str.indexOf("oooo") > -1;
    }

    function clear() {
        $(".player1")
            .children()
            .css("background-image", "none");
        $(".player2")
            .children()
            .css("background", "none");
        $(".player1").removeClass("player1");
        $(".player2").removeClass("player2");
    }

    function victory() {
        victoryDialog.addClass("on");
        darken.addClass("on");
        var isChrome =
            /Chrome/.test(navigator.userAgent) &&
            /Google Inc/.test(navigator.vendor);
        if (!isChrome) {
            frameHolder.append(
                "<iframe src='music.mp3' allow='autoplay' style='display:none' id='iframeAudio'></iframe>"
            );
        } else {
            frameHolder.append(
                "<audio autoplay loop  id='playAudio'><source src='music.mp3'></audio>"
            );
        }

        if (currentPlayer == "player1") {
            updatePlayer.prepend("<p>Player One</p>");
        } else {
            updatePlayer.prepend("<p>Player Two</p>");
        }

        fall.addClass("go");
        cool.on("click", function() {
            updatePlayer.empty();
            frameHolder.empty();
            victoryDialog.removeClass("on");
            darken.removeClass("on");
            clear();
            fall.removeClass("go");
        });
    }

    function checkRight(rowNumber, columnNumber) {
        var diagSlots = [];
        var j = 0;
        var step1 = 1;
        var step2 = 1;
        diagSlots.push(
            allColumns
                .eq(columnNumber)
                .find(".slot")
                .eq(rowNumber)
        );
        var currentSlot1 = allColumns
            .eq(columnNumber - step1)
            .find(".slot")
            .eq(rowNumber + step1);
        var currentSlot2 = allColumns
            .eq(columnNumber + step2)
            .find(".slot")
            .eq(rowNumber - step2);

        while (j < 4) {
            if (
                columnNumber - step1 >= 0 &&
                rowNumber + step1 <= 5 &&
                currentSlot1.hasClass(currentPlayer)
            ) {
                diagSlots.push(currentSlot1);
                step1++;
                currentSlot1 = allColumns
                    .eq(columnNumber - step1)
                    .find(".slot")
                    .eq(rowNumber + step1);
                j++;
            } else {
                j = 0;
                break;
            }
        }

        while (j < 4) {
            if (
                columnNumber + step2 <= 6 &&
                rowNumber - step2 >= 0 &&
                currentSlot2.hasClass(currentPlayer)
            ) {
                diagSlots.push(currentSlot2);
                step2++;
                currentSlot2 = allColumns
                    .eq(columnNumber + step2)
                    .find(".slot")
                    .eq(rowNumber - step2);
                j++;
            } else {
                j = 0;
                break;
            }
        }
        return diagSlots.length >= 4;
    }

    function checkLeft(rowNumber, columnNumber) {
        var diagSlotsLeft = [];
        var j = 0;
        var step1 = 1;
        var step2 = 1;
        diagSlotsLeft.push(
            allColumns
                .eq(columnNumber)
                .find(".slot")
                .eq(rowNumber)
        );
        var currentSlot1 = allColumns
            .eq(columnNumber + step1)
            .find(".slot")
            .eq(rowNumber + step1);
        var currentSlot2 = allColumns
            .eq(columnNumber - step2)
            .find(".slot")
            .eq(rowNumber - step2);

        while (j < 4) {
            if (
                columnNumber + step1 <= 6 &&
                rowNumber + step1 <= 5 &&
                currentSlot1.hasClass(currentPlayer)
            ) {
                diagSlotsLeft.push(currentSlot1);
                step1++;
                currentSlot1 = allColumns
                    .eq(columnNumber + step1)
                    .find(".slot")
                    .eq(rowNumber + step1);
                j++;
            } else {
                j = 0;
                break;
            }
        }

        while (j < 4) {
            if (
                columnNumber - step2 >= 0 &&
                rowNumber - step2 >= 0 &&
                currentSlot2.hasClass(currentPlayer)
            ) {
                diagSlotsLeft.push(currentSlot2);
                step2++;
                currentSlot2 = allColumns
                    .eq(columnNumber - step2)
                    .find(".slot")
                    .eq(rowNumber - step2);
                j++;
            } else {
                j = 0;
                break;
            }
        }

        return diagSlotsLeft.length >= 4;
    }
})();
