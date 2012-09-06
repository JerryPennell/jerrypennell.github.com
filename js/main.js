/*
Jerry Pennell
Advanced Scalable Data Infrastructures
week 2 
Term 1208  
Backbone framework
*/

var comix = {};

(function($){
    comix.Comic = Backbone.Model.extend({
        defaults: {
            date: new Date(),
            publisher: '',
            title: '',
            comments: '',
            issue: ''
        },
        
        set: function(attributes, options) {
            var aDate;
            if (attributes.date){
                //TODO future version - make sure date is valid format during input
                aDate = new Date(attributes.date);
                if ( Object.prototype.toString.call(aDate) === "[object Date]" && !isNaN(aDate.getTime()) ){
                    attributes.date = aDate;
                }
            }
            Backbone.Model.prototype.set.call(this, attributes, options);
        },
        
        dateInputType: function(){
            return comix.formatDate(this.get('date'), "yyyy-mm-dd");
        },
        
        displayDate: function(){
            return comix.formatDate(this.get('date'), "mm/dd/yyyy");
        },
        
        toJSON: function(){
            var json = Backbone.Model.prototype.toJSON.call(this);
            return _.extend(json, {dateInputType : this.dateInputType(), displayDate: this.displayDate()});
        }
    });
    
    comix.formatDate = function(date, formatString){
        var yyyy, month, mm, day, dd, formatedDate;
        
        if (date instanceof Date){
            yyyy = date.getFullYear();
            month = date.getMonth() + 1;
            mm = month < 10 ? "0" + month : month;
            day = date.getDate();
            dd = day < 10 ? "0" + day : day;
            
            formatedDate = formatString.replace(/yyyy/i, yyyy);
            formatedDate = formatedDate.replace(/mm/i, mm);
            formatedDate = formatedDate.replace(/dd/i, dd);
        }else{
            formatedDate = "";
        }
        
        return formatedDate;
    };
    
    comix.Comics = Backbone.Collection.extend({
        model: comix.Comic,
        url: "comic.json",
        comparator: function(comic){
            var date = new Date(comic.get('date'));
            return date.getTime();
        }
    });
    
    comix.ComicListView = Backbone.View.extend({
        tagName: 'ul',
        id: 'comic-list',
        attributes: {"data-role": 'listview', "data-inset": 'true'},
        
        initialize: function() {
            this.collection.bind('add', this.render, this);
            this.collection.bind('change', this.changeItem, this);
            this.collection.bind('reset', this.render, this);
            this.template = _.template($('#comic-list-item-template').html());
        },
        
        render: function() {
            var container = this.options.viewContainer,
                comics = this.collection,
                template = this.template,
                listView = $(this.el);
                
            container.empty();
            $(this.el).empty();
            comics.each(function(comic){
                this.renderItem(comic);
            }, this);
            container.html($(this.el));
            container.trigger('create');
            return this;
        },
        
        renderItem: function(item) {
            var template = this.template,
                listView = $(this.el),
                renderedItem = template(item.toJSON()),
                $renderedItem = $(renderedItem);
                
            $renderedItem.jqmData('comicId', item.get('id'));
            $renderedItem.bind('click', function(){
                //set the activity id on the page element for use in the details pagebeforeshow event
                $('#comic-details').jqmData('comicId', $(this).jqmData('comicId'));  //'this' represents the element being clicked
            });
            
            listView.append($renderedItem);
        },
        
        changeItem: function(item){
            this.collection.sort();
        }
    });
    
    comix.ComicDetailsView = Backbone.View.extend({
        //since this template will render inside a div, we don't need to specify a tagname
        initialize: function() {
            this.template = _.template($('#comic-details-template').html());
        },
        
        render: function() {
            var container = this.options.viewContainer,
                comic = this.model,
                renderedContent = this.template(this.model.toJSON());
                
            container.html(renderedContent);
            container.trigger('create');
            return this;
        }
    });
    
    comix.ComicDataView = Backbone.View.extend({
        attributes: {"data-role": 'fieldcontain'},
        //since this template will render inside a div, we don't need to specify a tagname
        initialize: function() {
            this.template = _.template($('#comic-data-template').html());
        },
        
        render: function() {
            var container = this.options.viewContainer,
                comic = this.model,
                renderedContent = this.template(this.model.toJSON());
                
            container.html(renderedContent);
            container.trigger('create');
            return this;
        }
    });    
    
    comix.ComicFormView = Backbone.View.extend({
        //since this template will render inside a div, we don't need to specify a tagname, but we do want the fieldcontain
        attributes: {"data-role": 'fieldcontain'},
        
        initialize: function() {
            this.template = _.template($('#comic-form-template').html());
        },
        
        render: function() {
            var container = this.options.viewContainer,
                renderedContent = this.template(this.model.toJSON());
                
            container.html(renderedContent);
            container.trigger('create');
            return this;
        }
    });   
    
    comix.initData = function(){
        comix.comics = new comix.Comics();
        comix.comics.fetch({async: false});  // use async false to have the app wait for data before rendering the list
    };
    
}(jQuery));

$('#comics').live('pageinit', function(event){
    var comicsListContainer = $('#comics').find(":jqmData(role='content')"),
        comicsListView;
    comix.initData();
    comicsListView = new comix.ComicListView({collection: comix.comics, viewContainer: comicsListContainer});
    comicsListView.render();
});


$(function(){
    
    $('#add-button').live('click', function(){
        var comic = new comix.Comic(),
            comicForm = $('#comic-form-form'),
            comicFormView;
    
        //clear any existing id attribute from the form page
        $('#comic-details').jqmRemoveData('comicId');
        comicFormView = new comix.ComicFormView({model: comic, viewContainer: comicForm});
        comicFormView.render();
    });

    $('#comic-details').live('pagebeforeshow', function(){
        console.log('comicId: ' + $('#comic-details').jqmData('comicId'));
        var comicsDetailsContainer = $('#comic-details').find(":jqmData(role='content')"),
            comicDetailsView,
            comicId = $('#comic-details').jqmData('comicId'),
            comicModel = comix.comics.get(comicId);
    
        comicDetailsView = new comix.ComicDetailsView({model: comicModel, viewContainer: comicsDetailsContainer});
        comicDetailsView.render();
    });
    
    $('#gear-button').live('click', function(){
        var comic = new comix.Comic(),
            comicForm = $('#comic-data-form'),
            comicDataFormView;
    
        //clear any existing id attribute from the form page
        $('#comic-data').jqmRemoveData('comicId');
        comicDataFormView = new comix.ComicDataView({model: comic, viewContainer: comicForm});
        comicDataFormView.render();
    });    
    	           

    $('#edit-comic-button').live('click', function() {
        var comicId = $('#comic-details').jqmData('comicId'),
            comicModel = comix.comics.get(comicId),
            comicForm = $('#comic-form-form'),
            comicFormView;
        
        comicFormView = new comix.ComicFormView({model: comicModel, viewContainer: comicForm});
        comicFormView.render();
    });
    
    $('#save-comic-button').live('click', function(){
        var comicId = $('#comic-details').jqmData('comicId'),
            comic,
            dateComponents,
            formJSON = $('#comic-form-form').formParams();
        
        //if we are on iOS and we have a date...convert it from yyyy-mm-dd back to mm/dd/yyyy
        //TODO future version - for non-iOS, we would need to validate the date is in the expected format (mm/dd/yyyy)
        if (formJSON.date && ((navigator.userAgent.indexOf('iPhone') >= 0 || navigator.userAgent.indexOf('iPad') >= 0)) ){
            dateComponents = formJSON.date.split("-");
            formJSON.date = dateComponents[1] + "/" + dateComponents[2] + "/" + dateComponents[0];
        }
        
        if (comicId){
            //editing
            comic = comix.comics.get(comicId);
            comic.set(formJSON); //not calling save since we have no REST backend...save in memory
        }else{
            //new (since we have no REST backend, create a new model and add to collection to prevent Backbone making REST calls)
            comic = new comix.Comic(formJSON);
            comic.set({'id': new Date().getTime()});  //create some identifier
            comix.comics.add(comic);
        }
    });
    
});