define(["userProfile"], function(profile) {

    return {
        save: function() {
            console.log("Settings : save");
            profile.update();
            return true;
        }
    };

});
