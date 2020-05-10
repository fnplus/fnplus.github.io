var $parameters = {
  urlname: "geek-meetup-chennai",
  width: 500,
  _name: "Meetup Group Stats",
  _description: "Shows basic stats on your favorite Meetup group."
};

var $queries = {
  groups: function() {
    return mup_widget.api_call("/2/groups", {
      group_urlname: $parameters.urlname
    });
  },
  events: function() {
    return mup_widget.api_call("/2/events", {
      group_urlname: $parameters.urlname,
      page: "100"
    });
  },
  past_events: function() {
    return mup_widget.api_call("/2/events", {
      group_urlname: $parameters.urlname,
      page: "1000",
      status: "past"
    });
  }
};

var load_widget = function($, ctx) {
  var group = "",
    months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    addLink = function(content, link) {
      return '<a target="_blank" href="' + link + '">' + content + "</a>";
    },
    addImage = function(src, alt) {
      return src == ""
        ? ""
        : '<div class="mup-img-wrap"><img src="' +
            src +
            '" width="' +
            ($parameters.width - 50) +
            '" alt="' +
            alt +
            '" class="mup-img"/></div>';
    },
    // Meetup Rating add star

    // addStarRating = function (rating) {
    //     var base_url =
    //         'https://a248.e.akamai.net/secure.meetupstatic.com/img/03784007994490629714917/star_';
    //     var starlink = '';
    //     if (rating == 0) {
    //         return 'Not Yet Rated';
    //     } else if (rating < 1.25) {
    //         starlink = "100.png";
    //     } else if (rating < 1.75) {
    //         starlink = "150.png";
    //     } else if (rating < 2.25) {
    //         starlink = "200.png";
    //     } else if (rating < 2.75) {
    //         starlink = "250.png";
    //     } else if (rating < 3.25) {
    //         starlink = "300.png";
    //     } else if (rating < 3.75) {
    //         starlink = "350.png";
    //     } else if (rating < 4.25) {
    //         starlink = "400.png";
    //     } else if (rating < 4.75) {
    //         starlink = "450.png";
    //     } else {
    //         starlink = "500.png";
    //     }
    //     return '<img src="' + base_url + starlink + '" alt="' + rating + '" />';

    // },
    addLeadingZero = function(num) {
      return num < 10 ? "0" + num : num;
    },
    getFormattedDate = function(millis) {
      var date = new Date(millis);
      return (
        months[date.getMonth()] +
        " " +
        addLeadingZero(date.getDate()) +
        ", " +
        date.getFullYear().toString()
      );
    },
    getFormattedDateObject = function(millis) {
      var date = new Date(millis);
      return {
        date: addLeadingZero(date.getDate()),
        month: months[date.getMonth()],
        year: date.getFullYear()
      };
    },
    getFormattedTime = function(millis) {
      var time = new Date(millis),
        hours = time.getHours(),
        min = time.getMinutes(),
        ampm = hours > 11 ? "PM" : "AM";
      min = min < 10 ? "0" + min : min;
      hours = hours == 0 ? 1 : hours;
      hours = hours > 12 ? hours - 12 : hours;
      return hours + ":" + min + " " + ampm;
    },
    numberFormat = function(nStr) {
      nStr += "";
      x = nStr.split(".");
      x1 = x[0];
      x2 = x.length > 1 ? "." + x[1] : "";
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) x1 = x1.replace(rgx, "$1" + "," + "$2");
      return x1 + x2;
    };
  $.getJSON($queries.groups(), function(data) {
    if (data.results.length == 0) {
      $(".mug-badge", ctx).append(
        '<div class="mup-widget error">\
							<div class="errorMsg">Oops. No results for "' +
          $parameters.urlname +
          '"</div>\
					</div>'
      );
    } else {
      group = data.results[0];
      $(".mug-badge", ctx).append(
        '<div class="mup-widget ">\
					<div class="mup-bd">\
						<h3>' +
          addLink(group.name, group.link) +
          '</h3>\
            <h4> <div style="padding-top:5px;"><span class="mup-tlabel mup-est">EST. ' +
          getFormattedDate(group.created) +
          '</span></div></h4>\
						<span class="mup-stats">' +
          addImage(
            group["group_photo"] ? group.group_photo.photo_link : "",
            group.name
          ) +
          numberFormat(group.members) +
          '<span class="mup-tlabel mup-who"> ' +
          group.who +
          '</span></span>\
            <span class="mup-stats mup-meetups"><div class="next-event"></div></span>\
					</div>\
					<div class="mup-ft">\
                         <div class="mup-logo"><div style="float:left;">' +
          // Meetup Logo

          // addLink(
          //     '<img src="https://a248.e.akamai.net/secure.meetupstatic.com/img/84869143793177372874/birddog/everywhere_widget.png">',
          //     'http://www.meetup.com') +

          // Meetup Rating

          // '</div><div style="float:right;"><div style="float:right;">' +
          // addStarRating(group.rating) +
          // '</div><br><div style="float:right;"><span class="mup-tlabel">Group Rating</span></div></div>' +

          "</div>"
      );

      $.getJSON($queries.events(), function(data) {
        if (data.status && data.status.match(/^200/) == null) {
          alert(data.status + ": " + data.details);
        } else {
          if (
            data.results.length == 0 ||
            data.results[0].name.indexOf("RSVP") !== -1
          ) {
            $(".next-event", ctx).append(
              '<span class="mup-tlabel mup-meetups">No Meetups at the Moment.\
                        <br>\
                         Join our Meetup Group to get Updates.</span>'
            );
          } else {
            if (data.results.length > 1) {
              $(".mug-badge", ctx).append(
                '<div class="muupcom-widget"> \
                            <div class="mupast-heading">Upcoming Meetups</div> \
                        </div>'
              );

              $(".muupcom-widget", ctx).append(
                '<div class="muupcom-meetups"></div>'
              );

              let upcoming_events_array = data.results.slice(1, 5);
              for (var i in upcoming_events_array) {
                let event = upcoming_events_array[i];
                let name = event.name;
                var venue = event.venue;
                var venue_addr;
                if (venue) {
                  if (venue.name !== undefined) {
                    venue_addr = " | " + venue.name;
                  } else if (venue.address_1 !== undefined) {
                    venue_addr = " | " + venue.address_1;
                  } else {
                    venue_addr = "";
                  }
                } else {
                  venue_addr = "";
                }

                $(".muupcom-meetups", ctx).append(
                  '<div class="mupast-main"> \
                                <div class= "mupast-inner"> \
                                    <div class="mupast-inner-text">' +
                    getFormattedDate(event.time).replace(",", "") +
                    ' </div> \
                                    </div> \
                                        <div class="muupcom-content"> \
                                            <div class="mupast-widget-heading"><a class="hover-animation" href="' +
                    event.event_url +
                    '" target="_blank">' +
                    name +
                    "</a></div> \
                    <div class='muupcom-time'> " +
                    getFormattedTime(event.time) +
                    venue_addr +
                    "</div> \
                                        </div> \
                                    </div>"
                );
              }
            }
            var event = data.results[0];
            var venue = event.venue;
            var city;
            if (!venue || !venue.city) {
              city = group.city;
            } else {
              city = venue.city;
            }
            var venue_addr;
            if (venue) {
              if (venue.name !== undefined) {
                venue_addr = venue.name + " - ";
              } else if (venue.address_1 !== undefined) {
                venue_addr = venue.address_1 + " - ";
              } else {
                venue_addr = "";
              }
            } else {
              venue_addr = "";
            }
            var location = venue_addr + city + ", India";

            let name = event.name;
            $(".next-event", ctx).append(
              "<div class='mup-tlabel mupn-heading'> \
                            <a target='_blank' href='" +
                event.event_url +
                "'>" +
                name +
                "</a> \
                            </div>" +
                '<div class="mup-tlabel">' +
                getFormattedDate(event.time) +
                "   |   " +
                getFormattedTime(event.time) +
                "</div>" +
                '<div class="mup-tlabel">' +
                location +
                "</div>"
            );
          }
        }
      });

      $.getJSON($queries.past_events(), function(data) {
        if (data.status && data.status.match(/^200/) == null) {
          $(".mupast-widget", ctx).append(
            '<div class="mupast-nojams">Upcoming Meetups</div>'
          );
          alert(data.status + ": " + data.details);
        } else {
          if (data.results.length == 0) {
            $(".mupast-widget", ctx).append(
              '<div class="mupast-nojams">No Meetups</div>'
            );
          } else {
            $(".mug-badge", ctx).append(
              '<div class="mupast-widget"> \
                            <div class="mupast-heading">Past Meetups</div> \
                        </div>'
            );

            $(".mupast-widget", ctx).append(
              '<div class="mupast-meetups">\
          <section id="archive" class="archive reset-this"> \
            <div class= "previous-editions" > \
            <div class="events"> \
              <div class="years"> \
              </div> \
              <div class="months"> \
              </div> \
              <div class="content"> \
              </div> \
              </div> \
        </div> \
        </section> \
        <div class="past-meetup-btn"> <a class="btn-view" \
         target="_blank" \
         href="https://www.meetup.com/geek-meetup-chennai/" \
         >Check out our Meetup Page<i class="icon-arrow-right3"></i></a> \
         </div>'
            );
            let past_events_array = data.results.reverse(); //.slice(0, 100);

            let TrackYears = [];
            let TrackMonths = [];

            for (var i in past_events_array) {
              let event = past_events_array[i];

              let eventDate = getFormattedDateObject(event.time);

              if (!TrackYears.includes(eventDate.year)) {
                TrackYears.push(eventDate.year);
              }
            }

            TrackYears.forEach(year => {
              $(".years", ctx).append(
                '<div id="year-' +
                  year +
                  '" class="year show" onclick="getEventsFor(this.id, this.textContent)">' +
                  year +
                  "</div>"
              );
            });

            past_events_array.forEach(event => {
              let eventDate = getFormattedDateObject(event.time);

              let showClass = "";

              if (eventDate.year === TrackYears[0]) {
                showClass = "show";
              }

              let eventMonthDate = eventDate.month + " " + eventDate.date;

              if (!TrackMonths.includes(eventMonthDate)) {
                TrackMonths.push(eventMonthDate);
                $(".months").append(
                  '<div id="' +
                    eventDate.year +
                    '" class="event ' +
                    showClass +
                    '" onclick="getAgenda(event, this.id, this.textContent)">' +
                    eventMonthDate +
                    "</div >"
                );
              }

              let description = event.description;

              if (description.length > 1000) {
                description =
                  description.substring(0, 1000) +
                  '.... <a href="' +
                  event.event_url +
                  '" target="_blank">(Read More)</a>';
              }

              $(".content").append(
                // 2019-Jan 31
                '<div id="' +
                  eventDate.year +
                  "-" +
                  eventDate.month +
                  " " +
                  eventDate.date +
                  '" class="speakers show">' +
                  '<div class="past-title">' +
                  '<a href="' +
                  event.event_url +
                  '" target="_blank">' +
                  event.name +
                  "</a>" +
                  "</div> <br />" +
                  "<div class='past-time'><span>Time:</span> " +
                  getFormattedTime(event.time) +
                  " </div> <div class='past-attended'> <div class='past-separator'>|</div> <span>" +
                  event.yes_rsvp_count +
                  " Legit Geeks </span> attended</div><br />" +
                  '<div class="past-description"> ' +
                  description +
                  " </div><br/>" +
                  "<div class='past-know-more'><a href='" +
                  event.event_url +
                  "' target='_blank'>Know More</a></div><br/>" +
                  "</div>"
              );
            });

            $($(".years")[0].childNodes[1]).addClass("active");
            $($(".months")[0].childNodes[1]).addClass("active");
            $($(".content")[0].childNodes[1]).addClass("active");
            setClickListeners();
            highlightMenu();
            trimLongDescription();
          }
        }
      });
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  mup_widget.with_jquery(load_widget);

  var location_select = document.getElementById("meetup-location");

  location_select.addEventListener("change", function() {
    let location = location_select.value;

    document.querySelector(".mug-badge").innerHTML = "";

    $parameters.urlname = "geek-meetup-" + location;

    mup_widget.with_jquery(load_widget);
  });
});
