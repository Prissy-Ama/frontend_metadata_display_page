// desktop script
let fileInput = document.getElementById('file_input');
let chosenFile = document.getElementById('chosen-file');
let fileName = document.getElementById('file-name');

fileInput.onchange = () => {
	//for displaying the image
	let reader = new FileReader();
	reader.readAsDataURL(fileInput.files[0]);
	console.log(fileInput.files[0]);
	reader.onload = () => {
		chosenFile.setAttribute('src', reader.result);
	};
	var fullPath = document.getElementById('file_input').value;
	if (fullPath) {
		var startIndex = fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/');
		var filename = fullPath.substring(startIndex);
		if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
			filename = filename.substring(1);
		}

		// For displaying the name of the file on the fig-caption
		$('#file-name').append(`<b>${filename}</b>`);
	}
};

// mobile script
// Gaining access to the hamburger icon
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
	hamburger.classList.toggle('active');
	navMenu.classList.toggle('active');
});

// mobile dropdown menu styles
const manageAccount = document.getElementById('#manage-account');
const dropdownMenu = document.getElementById('#drop');

manageAccount.addEventListener('click', () => {
	manageAccount.classList.toggle('active');
	dropdownMenu.classList.toggle('active');
});

// looping through display metadata in order to display it in a column
let data = document.getElementById('display-metadata');
var Data = {};
Object.keys(data).forEach(function (key) {
	console.log('Key : ' + key + ', Value : ' + data[key]);
});

// share button script
const shareButton = document.querySelector('button');
const overlay = document.querySelector('.overlay');
const shareModal = document.querySelector('.share-now');

const title = window.document.title;
const url = window.document.location.href;

shareButton.addEventListener('click', () => {
	if (navigator.share) {
		navigator
			.share({
				title: `${title}`,
				url: `${url}`,
			})
			.then(() => {
				console.log('Thanks for sharing!');
			})
			.catch(console.error);
	} else {
		overlay.classList.add('show-share');
		shareModal.classList.add('show-share');
	}
});

overlay.addEventListener('click', () => {
	overlay.classList.remove('show-share');
	shareModal.classList.remove('show-share');
});

// Fitsum scripts
//adding event listener to the log in button
$('#formD').submit(async function (e) {
	e.preventDefault();
	var formData = new FormData(this);

	//this is for showing the loading screen
	$('#loading').removeClass('hide');

	$.ajax({
		type: 'POST',
		headers: {
			token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWQ4NDIxMzc3N2FjYTZhNTFjMjM1MiIsImlhdCI6MTY1OTczMzM3OSwiZXhwIjoxNjYwMzM4MTc5fQ.6H3IXcS2nuemWBj1fwV49xsLIPLFldrJ8arB_2LFoFQ',
		},
		url: 'http://localhost:3000/files/62ed84213777aca6a51c2352',
		data: formData,
		processData: false,
		contentType: false,
		success: await function (r) {
			console.log('result', r);
			$('#display-metadata').append(`<p>${r.metadata}</p>`);
			localStorage.setItem('fileUrl', r.fileURL);
			localStorage.setItem('fileName', r.fileName);

			//this is for hiding the loading screen
			$('#loading').addClass('hide');
		},
		error: function (e) {
			console.log('some error', e);
		},
	});
});

//link for downloading the file

$('#download-btn').on('click', () => {
	var fileUrl = localStorage.getItem('fileUrl');
	var fileName = localStorage.getItem('fileName');

	fetch(fileUrl)
		.then(resp => resp.blob())
		.then(blob => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			// the filename you want
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			alert('your file has been downloaded!'); // or you know, something with better UX...
		})
		.catch(() => alert('Somethin went wrong!'));
});
