/**
* 1. Get the Widgets from the API x
* 2. Build Table  using Jquery
* 3. Create a input box functionality for filtering
* 4. Create the detailed view (modal or separate page)
* 6. Sorting maybe if time
*/

$(document).ready(function () {

    var APIWidgets = null;
    var widgetShortList = [];

    API.getWidgets().then(function (result) {

        /**
        *
        *  Initializing the data (Hashing and Scaffolding)
        *
        */

        //Hashing results for easy access to document
        APIWidgets = hashResults(result);

        //initially add the rows
        for(var key in result){
            var widget = result[key];
            widgetShortList.push({name : result[key].name, size: result[key].size});
            // Table content order (Name,Size,Capacity,Details)
            addRow(widget)
        }

        /**
        *
        * User interactive functions
        *
        */


        // Filtering the list using a simple substring search -- Empty the table and add rows that fit the criteria
        $("#widget_search").keyup(function(e) {
            var query = $(this).val().toString().trim();

            emptyTable();

            for (var key in widgetShortList){
                // ~ = Result is greater than zero
                if (~widgetShortList[key].name.indexOf(query) || ~widgetShortList[key].size.toString().indexOf(query)){
                    var name = widgetShortList[key].name;
                    addRow(APIWidgets[name]);
                }
            }
        });

        // When a user requests details we open the modal
        $("button").click(function() {
            // Pull from the hash and add the details to the modal
            var name = $(this).attr("name");
            var widget = APIWidgets[name];
            $(".modal-title").text(widget.name);
            $(".modal-body").html('<p>Size: ' + widget.size + '</p><p>Capacity: ' + widget.capacity + '<p>');

        });

        /**
        *
        * Helper functions
        *
        */

        // Hashing results by
        function hashResults(results) {
            var tempArray = []
            for (var key in results){
                var result = results[key];
                tempArray[result.name] = result;
            }

            return tempArray;
        }

        // Adding a new row to the table
        function addRow(widget) {
            var newRow = '<tr class="itemized_widget"><td class="name">' + widget.name + '</td><td class="size">' + widget.size + '</td><td class="capacity">' + widget.capacity + '</td><td class="details"><button type="button" class="btn btn-default btn-sm" data-toggle="modal" data-target="#myModal" name="' + widget.name + '">Details</button></td></tr>';
            $("#api_widget_tbl tbody").append(newRow);
        }

        // Emptying the entire table
        function emptyTable() {
            $("#api_widget_tbl tbody").empty();

        }

    });
})
