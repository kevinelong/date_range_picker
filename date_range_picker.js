
CLEVERCLEVER.DateRangePicker = function () {

    var insertAfter = CLEVERCLEVER.insertAfter;
    var Button = CLEVERCLEVER.Button;
    var create = CLEVERCLEVER.create;
    var DateRange = CLEVERCLEVER.DateRange;

    document.addEventListener("DOMContentLoaded",function(){
        document.getElementsByTagName('head')[0].appendChild(create('link',"",{"rel":"stylesheet","href":"main.css"}));
    });

    function getDialog(item, callback) {

        var target;
        var dialog;
        var choicePanel;
        var secondary;
        var range = undefined;


        function getActions(list) {

            var actions = create("div");

            for (var i = 0; i < list.length; i++) {
                actions.appendChild(list[i]);
            }

            return actions;
        }


        function getChoices(list, parentKey) {

            var choices = create("div", "",
                {
                    "className":"choiceList",
                    "style": "position:relative;display:block;min-height:3em;"
                }
            );


            function onClickChoice() {
                var item = undefined;

                if (this.parentKey != undefined) {

                    item = choiceList[this.parentKey].children[this.itemKey];

                } else {

                    item = choiceList[this.itemKey];

                }

                secondary.innerHTML = "";


                if (item == undefined) {

                    return;

                }

                if (item.action != undefined) {

                    return item.action.call(item, item);

                }

                if (item.children != undefined) {
                    choicePanel.remove();
                    secondary.appendChild(getChoices(item.children, this.itemKey));

                }

            }

            for (var i = 0; i < list.length; i++) {

                var o = list[i];
                choices.appendChild(Button(o.display, onClickChoice, {
                    "className": "choice",
                    "itemKey": i,
                    "parentKey": parentKey
                }));

            }

            return choices;

        }


        function close() {

            dialog.remove();

        }


        function onClickOK() {

            callback.call(target, range);
            close();

        }


        function setRange(dateRange) {

            range = dateRange;
            console.log(range.toString());

        }


        function dateAdd(d,days){

            var d2 = new Date();
            d2.setDate(d.getDate() + days);

            return d2;

        }


        function today() {

            var d = new Date();
            setRange(new DateRange(d, d));
            onClickOK();

        }


        function yesterday() {

            var d = new Date();
            var d2 = dateAdd(d,-1);
            setRange(new DateRange(d, d2));
            onClickOK();

        }

        function getFirstDayOfWeek(d) {
            d = new Date(d);
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            return new Date(d.setDate(diff));
        }

        function thisWeek() {
            var d = getFirstDayOfWeek(new Date());
            setRange(new DateRange(d, dateAdd(d,+7)));
            onClickOK();
        }


        function lastWeek() {
            var d = getFirstDayOfWeek(dateAdd(new Date(),-7));
            setRange(new DateRange(d, dateAdd(d,+7)));
            onClickOK();
        }


        function thisMonth() {
            var d = new Date();
            var first = new Date(d.getFullYear(), d.getMonth(), 0);
            var last = new Date(d.getFullYear(), d.getMonth()+1, 0);
            setRange(new DateRange(first, last));
            onClickOK();
        }


        function lastMonth() {
            var d = new Date();
            var first = new Date(d.getFullYear(), d.getMonth()-1, 0);
            var last = new Date(first.getFullYear(), first.getMonth()+1, 0);
            setRange(new DateRange(first, last));
            onClickOK();
        }


        function twoMonthsAgo() {

            var d = new Date();
            d = dateAdd(d,-60);
            var d2 = dateAdd(d,-90);
            setRange(new DateRange(d2, d));
            onClickOK();

        }


        var choiceList = [];
        var day = {"name": "day", "display": "Day", "children": []};

        day.children = [
            {parent: day, "name": "today", "display": "Today", "action": today},
            {parent: day, "name": "yesterday", "display": "Yesterday", "action": yesterday}
        ];

        choiceList.push(day);

        var week = {"name": "week", "display": "Week", "children": []};
        week.children = [
            {parent: week, "name": "thisWeek", "display": "This Week", "action": thisWeek},
            {parent: week, "name": "lastWeek", "display": "Last Week", "action": lastWeek}
        ];
        choiceList.push(week);

        var month = {"name": "month", "display": "Month", "children": []};
        month.children = [
            {parent: month, "name": "thisMonth", "display": "This Month", "action": thisMonth},
            {parent: month, "name": "lastMonth", "display": "Last Month", "action": lastMonth},
            {parent: month, "name": "twoMonthsAgo", "display": "Month Before Last.", "action": twoMonthsAgo}
        ];
        choiceList.push(month);

        target = item;

        dialog = create("div", "", {
            "className": "dialog",
            "style": "width:13em;height:auto;background-color:white;border:1px solid rgba(64,64,64,0.5);" +
            "position:absolute;box-shadow: 3px 3px 18px rgba(0,0,0,0.25);padding:1em 3em 1em 1em ;"
            + "left:" + (item.offsetLeft + item.offsetWidth) + "px;"
            + "top:" + item.offsetTop + "px;"
        });


        dialog.appendChild(Button("X", close, {style: "position:absolute;top:0;right:0;"}));
        choicePanel = getChoices(choiceList);
        dialog.appendChild(choicePanel);
        secondary = create("div", "", {});
        dialog.appendChild(secondary);

        // dialog.appendChild(getActions([
        //     Button("OK", onClickOK),
        //     Button("Cancel", close)
        // ]));

        insertAfter(item, dialog);

    }


    function applyToItem(item, callbackParameter) {

        var cb = callbackParameter;

        function onClickItem() {

            getDialog(item, cb);

        }

        insertAfter(item, Button("...", onClickItem));
    }


    function applyAll(selector, functionToApply, callbackParameter) {

        var list = document.querySelectorAll(selector);

        for (var i = 0; i < list.length; i++) {

            var item = list[i];
            functionToApply.call(item, item, callbackParameter);

        }

    }

    function apply(selector, callbackParameter) {

        applyAll(selector, applyToItem,callbackParameter)

    }

    return {

        apply: apply

    }

};


/***
 "1 hour window"
 "1 minute window"
 "30 minute window"
 "30 second window"
 "5 minute window"
 "All time"
 "All time (real-time)"
 "Business week to date"
 "Last 15 minutes"
 "Last 24 hours"
 "Last 30 days"
 "Last 4 hours"
 "Last 60 minutes"
 "Last 7 days"
 "Month to date"
 "Other"
 "Previous business week"
 "Previous month"
 "Previous week"
 "Previous year"
 "Real-time"
 "Today"
 "Week to date"
 "Year to date"
 "Yesterday"
 */