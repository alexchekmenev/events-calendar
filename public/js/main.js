$('#datepicker').datepicker({
    minDate: start,
    maxDate: end,
    dateFormat: 'yyyy-mm-dd',
    onSelect: function(formattedDate, date, inst) {
        console.log(arguments);
    }
});
var render = function() {
    console.log('render');
    getEvents(function(events) {
        $('.edit-action').off('click');
        $('.delete-action').off('click');
        $('#events-list').html('');
        events.data.forEach(function(event) {
            console.log('ID: ' + event._id);
            var date = new Date(event.date);
            var dateStr = date.getDate()+'/'+(date.getMonth() < 9 ? '0'+(date.getMonth() + 1) : '0'+date.getMonth());
            var str = '<li class="mdl-list__item mdl-list__item--three-line">'+
                '<span class="mdl-list__item-primary-content">'+
                '<i class="material-icons">event</i>'+
                '<span>'+dateStr+': '+event.name+'</span>'+
                '<span class="mdl-list__item-text-body">'+event.description+'</span>'+
                '</span>'+
                '<span class="mdl-list__item-secondary-content">'+
                '<a class="mdl-list__item-secondary-action edit-action" data-id="'+event._id+'" href="#"><i class="material-icons">create</i></a>'+
                '<a class="mdl-list__item-secondary-action delete-action" data-id="'+event._id+'" href="#"><i class="material-icons">delete</i></a>'+
                '</span>'+
                '</li>';
            $('#events-list').append(str);
        });
        $('.edit-action').on('click', function() {
            console.log('edit-action');
            var id = $(this).attr('data-id');
            loadById(id, function(event) {
                $('#event_id').val(id);
                var d = new Date(event.date);
                var month = d.getMonth() + 1;
                if (month < 10) {
                    month = '0'+month;
                }
                var day = d.getDate() + 1;
                if (day < 10) {
                    day = '0'+day;
                }
                var dateStr = d.getFullYear()+'-'+month+'-'+day;
                $('#datepicker').val(dateStr    );
                $('#name').val(event.name);
                $('#description').val(event.description);
            });
            //e.preventDefault();
        });

        $('.delete-action').on('click', function() {
            console.log('delete-action');
            var id = $(this).attr('data-id');
            removeEvent(id, function() {
                render();
            });
            //e.preventDefault();
        });
    });
}

var getEvents = function(callback) {
    $.ajax({
        url: '/events',
        type: 'GET',
        dataType: 'json',
        data: {
            start: start.toISOString(),
            end: end.toISOString()
        },
        success: function(events) {
            console.log(events);
            callback(events);
        }
    });
}

var getEvent = function(id, callback) {
    $.ajax({
        url: '/events/'+id,
        type: 'GET',
        dataType: 'json',
        success: function(events) {
            console.log(events);
            callback(events);
        },
        error: function(error) {
            callback(error);
        }
    });
}

var addEvent = function(data, callback) {
    console.log('addEvent', data);
    $.ajax({
        url: '/events',
        type: 'POST',
        dataType: 'json',
        data: data,
        error: function(error) {
            if (error.status == 201) {
                callback();
            }
        }
    });
};

var updateEvent = function(data, callback) {
    $.ajax({
        url: '/events',
        type: 'PUT',
        dataType: 'json',
        data: data,
        success: function(events) {
            console.log(events);
            callback(events);
        },
        error: function(error) {
            if (error.status == 200) {
                callback();
            }
        }
    });
}
var removeEvent = function(id, callback) {
    console.log('remove ID: '+id);
    $.ajax({
        url: '/events',
        type: 'DELETE',
        dataType: 'json',
        data: {
            id: id
        },
        success: function(events) {
            console.log(events);
            callback(events);
        },
        error: function(error) {
            if (error.status == 200) {
                callback();
            }
        }
    });
}

var loadById = function(id, callback) {
    $.ajax({
        url: '/events/id/'+id,
        type: 'GET',
        dataType: 'json',
        success: function(event) {
            console.log(event);
            callback(event);
        }
    });
}

var parseData = function() {
    return {
        id: $('#event_id').val(),
        date: $('#datepicker').val(),
        name: $('#name').val(),
        description: $('#description').val()
    }
}

$('#event-form').on('submit', function(e) {
    var eventId = $('#event_id').val();
    if (eventId != null && eventId != '') {
        updateEvent(parseData(), function() {
            console.log('updateEvent.callback');
            render();
        })
    } else {
        addEvent(parseData(), function () {
            console.log('addEvent.callback');
            render();
        });
    }
    e.preventDefault();
});

$(document).ready(function() {
    render();
});
