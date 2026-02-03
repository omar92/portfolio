require('./styles.scss');

var Flickity = require('flickity');
require('flickity-imagesloaded');

var $carousels = new Array();

// Data storage
var pageData = {
  experience: [],
  education: [],
  projects: [],
  contact: []
};

// Modals

var rootEl = document.documentElement;

function openModal(target) {
    var $target = document.getElementById(target);
    rootEl.classList.add('is-clipped');
    $target.classList.add('is-active');
    var carouselId = target + '-carousel';

    if (document.querySelector('#' + carouselId)) {
        // Initialize each carousel one time only
        if ($carousels.length === 0) {
            $carousels.push(initCarousel(carouselId));
        }
        else {
            var index = $carousels.findIndex(c => c.element.id == carouselId);
            if (index === -1) {
                $carousels.push(initCarousel(carouselId));
            }
        }
    }
}

function closeModals() {
    rootEl.classList.remove('is-clipped');
    $modals.forEach(function ($el) {
        $el.classList.remove('is-active');
    });
    
}

// Functions

function initCarousel(id) {
    return new Flickity('#' + id, {
        imagesLoaded: true,
        adaptiveHeight: true // https://github.com/metafizzy/flickity/issues/11
    });
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

// Load data from JSON files
function loadData() {
	return Promise.all([
		fetch('data/experience.json').then(response => response.json()),
		fetch('data/education.json').then(response => response.json()),
		fetch('data/projects.json').then(response => response.json()),
		fetch('data/contact.json').then(response => response.json())
	]).then(([experience, education, projects, contact]) => {
		pageData.experience = experience;
		pageData.education = education;
		pageData.projects = projects;
		pageData.contact = contact;
		
		// Render sections with loaded data
		renderExperience();
		renderEducation();
		renderProjects();
		renderContact();
		initializeEventListeners();
	}).catch(error => console.error('Error loading data:', error));
}

// Render Experience Section
function renderExperience() {
	var experienceContainer = document.querySelector('[data-section="experience"]');
	if (!experienceContainer) return;
	
	experienceContainer.innerHTML = '';
	
	pageData.experience.forEach(function(exp, index) {
		var cardClass = index === 0 ? 'card' : 'card card-gap';
		var html = `
			<div class="${cardClass}">
				<div class="card-content">
					<div class="media">
						<div class="media-left">
							<figure class="image is-48x48">
								<img src="${exp.logo}" alt="${exp.company}">
							</figure>
						</div>
						<div class="media-content">
							<p class="title is-4"><a href="${exp.url}">${exp.company}</a>${exp.subUrl ? ' <a href="' + exp.subUrl + '"><i>' + exp.subLabel + '</i></a>' : ''}</p>
							<p class="subtitle is-6">${exp.position} - <time datetime="${exp.startDateTime}">${exp.startDate}</time> - <time datetime="${exp.endDateTime}">${exp.endDate}</time></p>
						</div>
					</div>
					<div class="content has-text-light">
						<ul>
							${exp.description.map(item => `<li>${item}</li>`).join('')}
						</ul>
						<div class="tags">
							${exp.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
						</div>
					</div>
				</div>
			</div>
		`;
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
		var html = `
			<div class="${cardClass}">
				<div class="card-content">
					<div class="content">
						<p class="title is-4">${edu.school}</p>
						<p class="subtitle is-6">${edu.degree} - <time datetime="${edu.startDateTime}">${edu.startYear}</time> - <time datetime="${edu.endDateTime}">${edu.endYear}</time></p>
					</div>
					<div class="content has-text-light">
						<ul>
							${edu.details.map(detail => `<li><b>${detail.label}</b> ${detail.value}</li>`).join('')}
						</ul>
					</div>
				</div>
			</div>
		`;
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
		var html = `
			<div class="filterDiv ${filterClass}">
				<br>
				<div class="tile is-12 is-vertical is-parent box">
					<div class="tile is-parent modal-trigger" data-target="${project.modalId}">
						<article class="tile is-child is-4">
							<figure class="image">
								<img src="${project.image}">
							</figure>
						</article>
						<article class="box">
						</article>
						<article class="tile is-child">
							<p class="title is-4">${project.name}</p>
							<div class="tags">
								${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
							</div>
							<p class="has-text-light">${project.shortDescription}</p>
						</article>
					</div>
				</div>
			</div>
		`;
		projectsContainer.innerHTML += html;
	});
}

// Render Modals
function renderModals() {
	var modalsContainer = document.querySelector('[data-section="modals"]');
	if (!modalsContainer) return;
	
	modalsContainer.innerHTML = '';
	
	pageData.projects.forEach(function(project) {
		var html = `
			<div id="${project.modalId}" class="modal">
				<div class="modal-background"></div>
				<div class="modal-card">
					<header class="modal-card-head">
						<p class="modal-card-title">${project.name}</p>
						<button class="delete" aria-label="close"></button>
					</header>
					<section class="modal-card-body">
						<p class="title is-5">Description</p>
						<hr>
						<p class="has-text-light">${project.description}</p>
						${project.features ? '<p class="has-text-light">Features</p><ul style="list-style-type:circle; padding-left: 20px; " class="has-text-light">' + project.features.map(f => `<li>${f}</li>`).join('') + '</ul>' : ''}
						${project.subProjects ? project.subProjects.map(sp => `
							<br>
							<p class="title is-5">${sp.title}</p>
							<div class="tags">${sp.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
							<p class="has-text-light">${sp.description}</p>
							<hr>
						`).join('') : ''}
						<br>
						${project.sections ? project.sections.map(section => `
							<p class="title is-5">${section.title}</p>
							<hr>
							${section.type === 'iframe' ? section.content : ''}
							${section.type === 'images' ? section.images.map(img => `<img src="${img}">`).join('') : ''}
							${!section.type ? `<p class="has-text-light">${section.content}</p>` : ''}
							<br>
						`).join('') : ''}
					</section>
					<footer class="modal-card-foot">
						${project.links ? project.links.map(link => `<a class="${link.class}" href="${link.url}" target="${link.target}">${link.text}</a>`).join('') : ''}
						<button class="button is-success close">Close</button>
					</footer>
				</div>
			</div>
		`;
		modalsContainer.innerHTML += html;
	});
}

// Render Contact Section
function renderContact() {
	var contactContainer = document.querySelector('[data-section="contact"] nav');
	if (!contactContainer) return;
	
	contactContainer.innerHTML = '';
	
	pageData.contact.forEach(function(contact) {
		var html = `
			<div class="level-item has-text-centered">
				<div>
					<a href="${contact.url}" class="icon is-large">
						<i class="${contact.icon}"></i>
					</a>
					<p class="heading"><a href="${contact.url}">${contact.label}</a></p>
				</div>
			</div>
		`;
		contactContainer.innerHTML += html;
	});
}

// Initialize event listeners
function initializeEventListeners() {
	// Re-setup modal triggers and closes since DOM was regenerated
	$modalTriggers = getAll('.modal-trigger');
	$modalCloses = getAll('.modal-card-head .delete, .modal-card-foot .close');
	$modals = getAll('.modal');
	
	if ($modalTriggers.length > 0) {
		$modalTriggers.forEach(function ($el) {
			$el.addEventListener('click', function () {
				var target = $el.dataset.target;
				openModal(target);
			});
		});
	}

	if ($modalCloses.length > 0) {
		$modalCloses.forEach(function ($el) {
			$el.addEventListener('click', function () {
				stopVideos();
				closeModals();
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

filterSelection("All");
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
  console.log(arr1.join(" "));
}

// Initialize page with data from JSON files
document.addEventListener('DOMContentLoaded', function() {
	loadData().then(function() {
		renderModals();
		filterSelection("All");
	});
});
