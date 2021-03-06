// TODO:
// New Article
// Edit Article
// 		^be cool if this was on hover for properly permissioned user
// View Article
var EDITING_KEY = "editingArticle";
Session.setDefault(EDITING_KEY, false);

Template.article.helpers({
	editing: () => {
		if (Meteor.user().username === Template.currentData().username) 
			return (Session.get(EDITING_KEY));
	}
});

Template.article.events({
	'click .editable': (e, template) => {
		Session.set(EDITING_KEY, true);
	},
	'click #cancel': (e) => {
		Session.set(EDITING_KEY, false);
	},
	'click #submit': (e) => {

		var originalArticle = Template.currentData();
		var _revision = originalArticle.revision + 1;
		var _root_id = originalArticle.root_id;
		var _title = originalArticle.title;
		var _body = originalArticle.body;
		var _author = originalArticle.username;
		var _createdAt = originalArticle.createdAt;
		var titleEl = document.getElementById('js-editTitle');
		var bodyEl = document.getElementById('js-editBody');

		if (titleEl != null)
			_title = titleEl.value;

		if (bodyEl != null)
			_body =  bodyEl.value;

		Session.set(EDITING_KEY, false);

		// Just a note for future of other authors editing content
		// if (Meteor.user !== _author)
		// _author = Meteor.user;
		var _url = URLify2(_title + _revision);

		var article = {
			root_id: _root_id,
			revision: _revision,
			title: _title,
			body: _body,
			url: _url,
			createdAt: _createdAt,
			username: _author
		};

		Meteor.call('saveArticle', article);

		// Not sure if this is the safest way to do this.
		Router.go('article.show', {author: _author, article_url: _url});
	}
});
