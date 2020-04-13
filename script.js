//Create namespace
const app = {}

app.currentMonth = "";
app.currentDay = "";

app.monthLookup = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]
//Create obj to hold calendar information and saved tasks
app.calendarLibrary = {
    January: {
        numDays: 31,
        blankColumns: 3,
        dailyTodo: []
    },
    February: {
        numDays: 29,
        blankColumns: 6,
        dailyTodo: []
    },
    March: {
        numDays: 31,
        blankColumns: 0,
        dailyTodo: [],
    },
    April: {
        numDays: 30,
        blankColumns: 3,
        dailyTodo: [],
    },
    May: {
        numDays: 31,
        blankColumns: 5,
        dailyTodo: [],
    },
    June: {
        numDays: 30,
        blankColumns: 1,
        dailyTodo: [],
    },
    July: {
        numDays: 31,
        blankColumns: 3,
        dailyTodo: [],
    },
    August: {
        numDays: 31,
        blankColumns: 6,
        dailyTodo: [],
    },
    September: {
        numDays: 30,
        blankColumns: 2,
        dailyTodo: [],
    },
    October: {
        numDays: 31,
        blankColumns: 4,
        dailyTodo: [],
    },
    November: {
        numDays: 30,
        blankColumns: 0,
        dailyTodo: [],
    },
    December: {
        numDays: 31,
        blankColumns: 2,
        dailyTodo: [],
    },

}

//Load selected month
app.loadMonth = function(month) {
    //Empty previous month info
    $('.gridDay').empty()
    //Add blank days before month begins
    for (let i=0; i < app.calendarLibrary[month]['blankColumns']; i++) {
        $('.gridDay').append("<div></div>")
    }
    //Add correct number of days to calendar
    for (let i = 0; i < app.calendarLibrary[month]['numDays']; i++) {
        $('.gridDay').append(`<div id='${(i+1)}'><a href='#agenda'>${(i+1)}</a></div>`)
    }
    //Insert respective month into calendar
    $('h2').text(`${month}`);

    app.currentMonth = month;

    app.highlightDays()
}

app.highlightDays = function() {
    for (let i = 0; i < app.calendarLibrary[app.currentMonth]['dailyTodo'].length; i++) {
        let todo = app.calendarLibrary[app.currentMonth]['dailyTodo'][i];
        if (todo.length !== 0) {
            $("#" + (i + 1)).addClass('event')
        } else {
            $("#" + (i + 1)).removeClass('event')
        }
    } 
}
app.deleteItem = function (e) {

    let todoText = "";
    if (e.target.nodeName === "I") {
        // The user clicked the <i>
        todoText = e.target.parentNode.parentNode.innerText;
        e.target.parentNode.parentNode.remove();
    } else {
        // The user clicked the <button>
        todoText = e.target.parentNode.innerText;
        e.target.parentNode.remove();
    }

    let index = app.calendarLibrary[app.currentMonth]['dailyTodo'][app.currentDay].indexOf(todoText);

    if (index !== -1) {
        app.calendarLibrary[app.currentMonth]['dailyTodo'][app.currentDay].splice(index, 1);
    }

    localStorage.setItem('calendarLibrary', JSON.stringify(app.calendarLibrary));
    app.highlightDays()
}

app.init = function() {

    for (let month in app.calendarLibrary) {
        for (let i = 0; i < app.calendarLibrary[month]['numDays']; i++) {
            // Add {numDays} arrays to this
            app.calendarLibrary[month]['dailyTodo'].push([])
        }
    }

    localCalendarLibrary = localStorage.getItem('calendarLibrary');
    if (localCalendarLibrary !== null) {
        app.calendarLibrary = JSON.parse(localCalendarLibrary);
    }

    app.loadMonth('April');

    $('.gridDay').on('click', function(e) {
        $('.agenda').show()
        $('.calendar').addClass('removeBottomBorder')
        app.currentDay = parseInt(e.target.innerText) - 1;

        //TODO: get items for this day and display
        $('ul').empty()
        let listItems = app.calendarLibrary[app.currentMonth]['dailyTodo'][app.currentDay];
        for (let i = 0; i < listItems.length; i++) {
            $('ul').append(`<li><i class='fas fa-star'></i>${listItems[i]}<button class='deleteItem'><i class='far fa-times-circle'></i> </button> </li>`);
        }
        // Remove deleteItem click handler and then add deleteItem click handler
        // We do this so the event handler is only called once
        $('.deleteItem').off('click').on('click', app.deleteItem)
        //Add date above input
        $('label').html(`Enter an event below to add it to <span>${app.currentMonth} ${app.currentDay + 1}</span>`);
    })


    $('form').on('submit', function (e) {
        e.preventDefault();
        let listItem = $('input').val().trim(' ');

        if (listItem !== '') {
            $('ul').append(`<li><i class='fas fa-star'></i>${listItem}<button class='deleteItem'><i class='far fa-times-circle'></i> </button> </li>`);
            $('input').val('');

            app.calendarLibrary[app.currentMonth]['dailyTodo'][app.currentDay].push(listItem);
        }

        // Remove deleteItem click handler and then add deleteItem click handler
        // We do this so the event handler is only called once
        $('.deleteItem').off('click').on('click', app.deleteItem)
        localStorage.setItem('calendarLibrary', JSON.stringify(app.calendarLibrary));
        app.highlightDays()
    }) 




    $('.cycleBackwards').on('click', function (e){

        let currentMonthIndex = app.monthLookup.indexOf(app.currentMonth)
        let prevMonthIndex = currentMonthIndex - 1;

        if (prevMonthIndex < 0) {
            prevMonthIndex = 11;
        }

        let prevMonth = app.monthLookup[prevMonthIndex];

        $('.agenda').hide()
        $('.calendar').removeClass('removeBottomBorder')
        app.loadMonth(prevMonth)
    })


    $('.cycleForwards').on('click', function (e) {

        let currentMonthIndex = app.monthLookup.indexOf(app.currentMonth)
        let nextMonthIndex = currentMonthIndex + 1;

        if (nextMonthIndex > 11) {
            nextMonthIndex = 0;
        }

        let nextMonth = app.monthLookup[nextMonthIndex];

        $('.agenda').hide()
        $('.calendar').removeClass('removeBottomBorder')
        app.loadMonth(nextMonth)
    })

    
}

$(function() {
    app.init();
})