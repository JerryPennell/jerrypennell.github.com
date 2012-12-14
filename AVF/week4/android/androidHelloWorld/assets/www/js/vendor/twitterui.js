// The view model 
var savedLists = [
    { name: "Celebrities", userNames: ['ladygaga', 'MCHammer', 'StephenFry', 'Oprah', 'piersmorgan']},
    { name: "Food Network", userNames: ['altonbrown', 'GDeLaurentiis', 'Chef_Aaron']},
    { name: "Technology", userNames: ['cnet', 'LeoLaporte', 'techcrunch', 'BoingBoing', 'engadget', 'codinghorror']}
];
 
function goBack()
{
  window.history.back();
}

var TwitterListModel = function(lists, selectedList) {
    this.savedLists = ko.observableArray(lists);
    this.editingList = {
        name: ko.observable(selectedList),
        userNames: ko.observableArray()
    };
    this.userNameToAdd = ko.observable("");
    this.currentTweets = ko.observableArray([])
 
    this.findSavedList = function(name) {
        var lists = this.savedLists();
        return ko.utils.arrayFirst(lists, function(list) {
            return list.name === name;
        });
    };
 
    this.addUser = function() {
        if (this.userNameToAdd() && this.userNameToAddIsValid()) {
            this.editingList.userNames.push(this.userNameToAdd());
            this.userNameToAdd("");
        }
    };
 
    this.removeUser = function(userName) {
        this.editingList.userNames.remove(userName)
    }.bind(this);
 
    this.saveChanges = function() {
        var saveAs = prompt("Save as", this.editingList.name());
        if (saveAs) {
            var dataToSave = this.editingList.userNames().slice(0);
            var existingSavedList = this.findSavedList(saveAs);
            if (existingSavedList) existingSavedList.userNames = dataToSave; // Overwrite existing list
            else this.savedLists.push({
                name: saveAs,
                userNames: dataToSave
            }); // Add new list
            this.editingList.name(saveAs);
        }
    };
 
    this.deleteList = function() {
        var nameToDelete = this.editingList.name();
        var savedListsExceptOneToDelete = $.grep(this.savedLists(), function(list) {
            return list.name != nameToDelete
        });
        this.editingList.name(savedListsExceptOneToDelete.length == 0 ? null : savedListsExceptOneToDelete[0].name);
        this.savedLists(savedListsExceptOneToDelete);
    };
 
    ko.computed(function() {
        // Observe viewModel.editingList.name(), so when it changes (i.e., user selects a different list) we know to copy the saved list into the editing list
        var savedList = this.findSavedList(this.editingList.name());
        if (savedList) {
            var userNamesCopy = savedList.userNames.slice(0);
            this.editingList.userNames(userNamesCopy);
        } else {
            this.editingList.userNames([]);
        }
    }, this);
 
    this.hasUnsavedChanges = ko.computed(function() {
        if (!this.editingList.name()) {
            return this.editingList.userNames().length > 0;
        }
        var savedData = this.findSavedList(this.editingList.name()).userNames;
        var editingData = this.editingList.userNames();
        return savedData.join("|") != editingData.join("|");
    }, this);
 
    this.userNameToAddIsValid = ko.computed(function() {
        return (this.userNameToAdd() == "") || (this.userNameToAdd().match(/^\s*[a-zA-Z0-9_]{1,15}\s*$/) != null);
    }, this);
 
    this.canAddUserName = ko.computed(function() {
        return this.userNameToAddIsValid() && this.userNameToAdd() != "";
    }, this);
 
    // The active user tweets are (asynchronously) computed from editingList.userNames
    ko.computed(function() {
        twitterApi.getTweetsForUsers(this.editingList.userNames(), this.currentTweets);
    }, this);
};
 
ko.applyBindings(new TwitterListModel(savedLists, "Technology"));
 
// Using jQuery for Ajax loading indicator 
$(".loadingIndicator").ajaxStart(function() {
    $(this).fadeIn();
}).ajaxComplete(function() {
    $(this).fadeOut();
});

