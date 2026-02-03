// Data loading and rendering script
// This runs after the main bundle

var pageData = {
  experience: [],
  education: [],
  projects: [],
  contact: []
};

// Load data from JSON files
function loadData() {
	return Promise.all([
		fetch('data/experience.json').then(response => {
			if (!response.ok) throw new Error('Failed to load experience.json');
			return response.json();
		}),
		fetch('data/education.json').then(response => {
			if (!response.ok) throw new Error('Failed to load education.json');
			return response.json();
		}),
		fetch('data/projects.json').then(response => {
			if (!response.ok) throw new Error('Failed to load projects.json');
			return response.json();
		}),
		fetch('data/contact.json').then(response => {
			if (!response.ok) throw new Error('Failed to load contact.json');
			return response.json();
		})
	]).then(([experience, education, projects, contact]) => {
		console.log('Data loaded successfully');
		pageData.experience = experience;
		pageData.education = education;
		pageData.projects = projects;
		pageData.contact = contact;
		
		// Render sections with loaded data
		renderExperience();
		renderEducation();
		renderProjects();
		renderContact();
		renderModals();
		initializeEventListeners();
		filterSelection("All");
	}).catch(error => console.error('Error loading data:', error));
}

// Render Experience Section
function renderExperience() {
	var experienceContainer = document.querySelector('[data-section="experience"]');
	if (!experienceContainer) return;
	
	experienceContainer.innerHTML = '';
	
	pageData.experience.forEach(function(exp, index) {
		var cardClass = index === 0 ? 'card' : 'card card-gap';
		var subUrlHtml = exp.subUrl ? ' <a href="' + exp.subUrl + '"><i>' + exp.subLabel + '</i></a>' : '';
		var html = '<div class="' + cardClass + '">\
				<div class="card-content">\
					<div class="media">\
						<div class="media-left">\
							<figure class="image is-48x48">\
								<img src="' + exp.logo + '" alt="' + exp.company + '">\
							</figure>\
						</div>\
						<div class="media-content">\
							<p class="title is-4"><a href="' + exp.url + '">' + exp.company + '</a>' + subUrlHtml + '</p>\
							<p class="subtitle is-6">' + exp.position + ' - <time datetime="' + exp.startDateTime + '">' + exp.startDate + '</time> - <time datetime="' + exp.endDateTime + '">' + exp.endDate + '</time></p>\
						</div>\
					</div>\
					<div class="content has-text-light">\
						<ul>\
							' + exp.description.map(function(item) { return '<li>' + item + '</li>'; }).join('') + '\
						</ul>\
						<div class="tags">\
							' + exp.skills.map(function(skill) { return '<span class="tag">' + skill + '</span>'; }).join('') + '\
						</div>\
					</div>\
				</div>\
			</div>';
		experienceContainer.innerHTML += html;
	});
}

// Render Education Section
function renderEducation() {
	var educationContainer = document.querySelector('[data-section="education"]');
	if (!educationContainer) return;
	
	educationContainer.innerHTML = '';
	
	pageData.education.forEach(function(edu, index) {
		var cardClass = index === 0 ? 'card' : 'card card-gap';
		var html = '<div class="' + cardClass + '">\
				<div class="card-content">\
					<div class="content">\
						<p class="title is-4">' + edu.school + '</p>\
						<p class="subtitle is-6">' + edu.degree + ' - <time datetime="' + edu.startDateTime + '">' + edu.startYear + '</time> - <time datetime="' + edu.endDateTime + '">' + edu.endYear + '</time></p>\
					</div>\
					<div class="content has-text-light">\
						<ul>\
							' + edu.details.map(function(detail) { return '<li><b>' + detail.label + '</b> ' + detail.value + '</li>'; }).join('') + '\
						</ul>\
					</div>\
				</div>\
			</div>';
		educationContainer.innerHTML += html;
	});
}

// Render Projects Section
function renderProjects() {
	var projectsContainer = document.querySelector('[data-section="projects"]');
	if (!projectsContainer) return;
	
	projectsContainer.innerHTML = '';
	
	pageData.projects.forEach(function(project) {
		var filterClass = project.filterTags.join(' ');
		var html = '<div class="filterDiv ' + filterClass + '">\
				<br>\
				<div class="tile is-12 is-vertical is-parent box">\
					<div class="tile is-parent modal-trigger" data-target="' + project.modalId + '">\
						<article class="tile is-child is-4">\
							<figure class="image">\
								<img src="' + project.image + '">\
							</figure>\
						</article>\
						<article class="box">\
						</article>\
						<article class="tile is-child">\
							<p class="title is-4">' + project.name + '</p>\
							<div class="tags">\
								' + project.tags.map(function(tag) { return '<span class="tag">' + tag + '</span>'; }).join('') + '\
							</div>\
							<p class="has-text-light">' + project.shortDescription + '</p>\
						</article>\
					</div>\
				</div>\
			</div>';
		projectsContainer.innerHTML += html;
	});
}

// Render Modals
function renderModals() {
	var modalsContainer = document.querySelector('[data-section="modals"]');
	if (!modalsContainer) return;
	
	modalsContainer.innerHTML = '';
	
	pageData.projects.forEach(function(project) {
		var sectionsHtml = '';
		if (project.sections) {
			sectionsHtml = project.sections.map(function(section) {
				var content = '';
				if (section.type === 'iframe') {
					content = section.content;
				} else if (section.type === 'images') {
					content = section.images.map(function(img) { return '<img src="' + img + '">'; }).join('');
				} else {
					content = '<p class="has-text-light">' + section.content + '</p>';
				}
				return '<p class="title is-5">' + section.title + '</p>\
					<hr>\
					' + content + '\
					<br>';
			}).join('');
		}
		
		var featuresHtml = '';
		if (project.features) {
			featuresHtml = '<p class="has-text-light">Features</p>\
				<ul style="list-style-type:circle; padding-left: 20px; " class="has-text-light">\
					' + project.features.map(function(f) { return '<li>' + f + '</li>'; }).join('') + '\
				</ul><br>';
		}
		
		var subProjectsHtml = '';
		if (project.subProjects) {
			subProjectsHtml = project.subProjects.map(function(sp) {
				return '<br><p class="title is-5">' + sp.title + '</p>\
					<div class="tags">' + sp.tags.map(function(tag) { return '<span class="tag">' + tag + '</span>'; }).join('') + '</div>\
					<p class="has-text-light">' + sp.description + '</p>\
					<hr>';
			}).join('');
		}
		
		var linksHtml = '';
		if (project.links) {
			linksHtml = project.links.map(function(link) {
				return '<a class="' + link.class + '" href="' + link.url + '" target="' + link.target + '">' + link.text + '</a>';
			}).join('');
		}
		
		var html = '<div id="' + project.modalId + '" class="modal">\
			<div class="modal-background"></div>\
			<div class="modal-card">\
				<header class="modal-card-head">\
					<p class="modal-card-title">' + project.name + '</p>\
					<button class="delete" aria-label="close"></button>\
				</header>\
				<section class="modal-card-body">\
					<p class="title is-5">Description</p>\
					<hr>\
					<p class="has-text-light">' + project.description + '</p>\
					' + featuresHtml + '\
					' + subProjectsHtml + '\
					' + sectionsHtml + '\
				</section>\
				<footer class="modal-card-foot">\
					' + linksHtml + '\
					<button class="button is-success close">Close</button>\
				</footer>\
			</div>\
		</div>';
		modalsContainer.innerHTML += html;
	});
}

// Render Contact Section
function renderContact() {
	var contactContainer = document.querySelector('[data-section="contact"] nav');
	if (!contactContainer) return;
	
	contactContainer.innerHTML = '';
	
	pageData.contact.forEach(function(contact) {
		var html = '<div class="level-item has-text-centered">\
				<div>\
					<a href="' + contact.url + '" class="icon is-large">\
						<i class="' + contact.icon + '"></i>\
					</a>\
					<p class="heading"><a href="' + contact.url + '">' + contact.label + '</a></p>\
				</div>\
			</div>';
		contactContainer.innerHTML += html;
	});
}

// Initialize event listeners
function initializeEventListeners() {
	var $modals = getAll('.modal');
	var $modalTriggers = getAll('.modal-trigger');
	var $modalCloses = getAll('.modal-card-head .delete, .modal-card-foot .close');
	var rootEl = document.documentElement;
	
	if ($modalTriggers.length > 0) {
		$modalTriggers.forEach(function ($el) {
			$el.addEventListener('click', function () {
				var target = $el.dataset.target;
				var $target = document.getElementById(target);
				rootEl.classList.add('is-clipped');
				$target.classList.add('is-active');
			});
		});
	}

	if ($modalCloses.length > 0) {
		$modalCloses.forEach(function ($el) {
			$el.addEventListener('click', function () {
				stopVideos();
				rootEl.classList.remove('is-clipped');
				$modals.forEach(function ($el) {
					$el.classList.remove('is-active');
				});
			});
		});
	}
	
	// Setup filter buttons
	var btnContainer = document.getElementById("filterBtnContainer");
	if (btnContainer) {
		var btns = btnContainer.getElementsByClassName("button");
		for (var i = 0; i < btns.length; i++) {
			btns[i].addEventListener("click", function($el){
				filterSelection($el.target.innerHTML);
				var current = document.getElementsByClassName("is-focused");
				if (current.length > 0) {
					current[0].className = current[0].className.replace(" is-focused", "");
				}
				this.className += " is-focused";
			});
		}
	}
}

function getAll(selector) {
	return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
}

var stopVideos = function () {
	var videos = document.querySelectorAll('iframe, video');
	Array.prototype.forEach.call(videos, function (video) {
		if (video.tagName.toLowerCase() === 'video') {
			video.pause();
		} else {
			var src = video.src;
			video.src = src;
		}
	});
};

function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "All") c = "";
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}

// Initialize on document ready
document.addEventListener('DOMContentLoaded', function() {
	console.log('DOM loaded, loading data...');
	loadData();
});
