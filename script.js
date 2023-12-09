//
//

const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;
//
//
//infinit scroll
window.addEventListener("scroll", function (e) {
	const endOfPage = window.innerHeight + window.pageYOffset + 200 >= document.body.scrollHeight;

	if (endOfPage && currentPage < lastPage) {
		currentPage = currentPage + 1;
		getPosts(false, currentPage);
	}
});
//infinit scroll ////

setupUI();
getPosts();

function getPosts(reload = true, page = 1) {
	toggleLoader(true);
	axios.get(`${baseUrl}/posts?limit=15&page=${page}`).then((response) => {
		toggleLoader(false);
		const posts = response.data.data;
		//
		lastPage = response.data.meta.last_page;
		if (reload) {
			document.getElementById("posts").innerHTML = "";
		}
		for (post of posts) {
			const author = post.author;
			let postTitle = "";
			//
			//
			//show or hide edit user

			let user = getCurrentUser();
			let isMyPost = user != null && post.author.id == user.id;
			//
			console.log(isMyPost);
			let editButtonContent = ``;

			if (isMyPost) {
				editButtonContent = `<button onclick="deletePostBtnClicked('${encodeURIComponent(
					JSON.stringify(post)
				)}')" class="btn btn-danger mx-1" style="float:right">Delete</button>
				<button onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" class="btn btn-secondary mx-1" style="float:right">Edit</button>`;
			}
			//
			//
			if (post.title !== null) {
				postTitle = post.title;
			}

			if (Object.keys(post.image).length) {
				let content = `
        <div class="card shadow">
							<div class="card-header">
							<span onclick="userClicked(${author.id})"style="cursor:pointer"><img src="${author.profile_image}" class="rounded-circle border border-2" alt="" style="width: 40px; height: 40px" />
								<b>${author.username}</b></span>	
							

								${editButtonContent}
							</div>
							<div class="card-body" style="cursor:pointer;" onclick="postClicked(${post.id})">
								<img src="${post.image}" class="w-100 " style="height:350px;" alt="" />
								<h6 style="color: rgb(193, 193, 193)" class="mt-1">${post.created_at}</h6>
								<h5>${post.title}</h5>
								<p>
									${post.body}
								</p>
								<hr />
								<div>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
										<path
											d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
										/>
									</svg>
									<span>(${post.comments_count}) Comments
                                    
                                    </span>
								</div>
							</div>
						</div>
        `;
				document.getElementById("posts").innerHTML += content;
			}
		}
	});
}

function loginBtnClicked() {
	const password = document.getElementById("password-input").value;
	const username = document.getElementById("username-input").value;
	const params = {
		username: username,
		password: password,
	};
	const url = `${baseUrl}/login`;
	toggleLoader(true);
	axios
		.post(url, params)
		.then((response) => {
			console.log(response.data.token);
			localStorage.setItem("token", response.data.token);
			localStorage.setItem("currentUser", JSON.stringify(response.data.user));
			const modal = document.getElementById("loginModal");
			const modalInstance = bootstrap.Modal.getInstance(modal);
			modalInstance.hide();
			showAlert("logged in successfully", "success");
			setupUI();
		})
		.catch((error) => {
			const Emessage = error.response.data.message;
			showAlert(Emessage, "danger");
		})
		.finally(() => {
			toggleLoader(false);
		});
}

function showAlert(customMessage, type = "success") {
	const alertPlaceholder = document.getElementById("successAlert");
	const alert = (message, type) => {
		const wrapper = document.createElement("div");
		wrapper.innerHTML = [
			`<div class="alert alert-${type} alert-dismissible" role="alert">`,
			`   <div>${message}</div>`,
			'   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
			"</div>",
		].join("");

		alertPlaceholder.append(wrapper);
	};
	alert(customMessage, type);

	//hide alert  TODO
	setTimeout(() => {
		//const alertToHide = bootstrap.Alert.getOrCreateInstance("#successAlert");
		//alertToHide.close();
	}, 2000);
}

function setupUI() {
	const loginDiv = document.getElementById("login-div");
	const logoutDiv = document.getElementById("logout-div");
	const token = localStorage.getItem("token");
	const addBtn = document.getElementById("addButton");
	//console.log(loginBtn.value);
	if (token == null) {
		if (addBtn != null) {
			addBtn.style.setProperty("display", "none", "important");
		}
		loginDiv.style.setProperty("display", "flex", "important");
		logoutDiv.style.setProperty("display", "none", "important");
	} else {
		// for logged in user
		if (addBtn != null) {
			addBtn.style.setProperty("display", "block", "important");
		}
		loginDiv.style.setProperty("display", "none", "important");
		logoutDiv.style.setProperty("display", "flex", "important");
		const user = getCurrentUser();
		document.getElementById("nav-username").innerHTML = user.username;
		document.getElementById("nav-user-image").src = user.profile_image;
	}
	getPosts();
}

function logout() {
	localStorage.removeItem("token");
	localStorage.removeItem("currentUser");
	showAlert("logged out successfully", "success");
	setupUI();
}

function registerBtnClicked() {
	const password = document.getElementById("register-password-input").value;
	const username = document.getElementById("register-username-input").value;
	const name = document.getElementById("register-name-input").value;
	const image = document.getElementById("register-Pimage-input").files[0];

	let formData = new FormData();

	formData.append("name", name);
	formData.append("username", username);
	formData.append("password", password);
	formData.append("image", image);

	const headers = {
		"Content-Type": "multipart/form-data",
	};

	const url = `${baseUrl}/register`;
	toggleLoader(true);
	axios
		.post(url, formData, {
			headers: headers,
		})
		.then((response) => {
			console.log(response.data);
			localStorage.setItem("token", response.data.token);
			localStorage.setItem("currentUser", JSON.stringify(response.data.user));
			const modal = document.getElementById("registerModal");
			const modalInstance = bootstrap.Modal.getInstance(modal);
			modalInstance.hide();
			showAlert("new user register successfully", "success");
			setupUI();
		})
		.catch((error) => {
			const Emessage = error.response.data.message;
			showAlert(Emessage, "danger");
		})
		.finally(() => {
			toggleLoader(false);
		});
}

function createNewPostClicked() {
	let postId = document.getElementById("post-id-input").value;
	let isCreate = postId == null || postId == "";

	const title = document.getElementById("post-title-input").value;
	const body = document.getElementById("post-body-input").value;
	const image = document.getElementById("post-image-input").files[0];
	const tokeen = localStorage.getItem("token");
	let formData = new FormData();
	formData.append("body", body);
	formData.append("title", title);
	formData.append("image", image);

	let url = ``;

	const headers = {
		"Content-Type": "multipart/form-data",
		authorization: `Bearer ${tokeen}`,
	};
	if (isCreate) {
		url = `${baseUrl}/posts`;
	} else {
		formData.append("_method", "put");
		url = `${baseUrl}/posts/${postId}`;
	}
	toggleLoader(true);
	axios
		.post(url, formData, {
			headers: headers,
		})
		.then((response) => {
			const modal = document.getElementById("create-post-modal");
			const modalInstance = bootstrap.Modal.getInstance(modal);
			modalInstance.hide();
			showAlert("new has been created successfully", "success");
			getPosts();
		})
		.catch((error) => {
			const Emessage = error.response.data.message;
			showAlert(Emessage, "danger");
		})
		.finally(() => {
			toggleLoader(false);
		});
}

function getCurrentUser() {
	let user = null;
	const storageUser = localStorage.getItem("currentUser");
	if (storageUser != null) {
		user = JSON.parse(storageUser);
	}

	return user;
}

function postClicked(postId) {
	window.location = `postDetails.html?postId=${postId}`;
}

function editPostBtnClicked(postObject) {
	let post = JSON.parse(decodeURIComponent(postObject));
	console.log(post);
	document.getElementById("post-modal-submit-btn").innerHTML = "UPDATE";
	document.getElementById("post-id-input").value = post.id;
	document.getElementById("post-modal-title").innerHTML = "Edit Post";
	document.getElementById("post-title-input").value = post.title;
	document.getElementById("post-body-input").value = post.body;

	let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
	postModal.toggle();
}
function addButtonClicked() {
	document.getElementById("post-modal-submit-btn").innerHTML = "Create";
	document.getElementById("post-id-input").value = "";
	document.getElementById("post-modal-title").innerHTML = "Create New Post";
	document.getElementById("post-title-input").value = "";
	document.getElementById("post-body-input").value = "";

	let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
	postModal.toggle();
}

function deletePostBtnClicked(postObject) {
	let post = JSON.parse(decodeURIComponent(postObject));
	console.log(post);
	document.getElementById("delete-post-id-input").value = post.id;
	let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {});
	postModal.toggle();
}
function confirmPostDelete() {
	const postId = document.getElementById("delete-post-id-input").value;
	const url = `${baseUrl}/posts/${postId}`;
	const token = localStorage.getItem("token");

	const headers = {
		"Content-Type": "multipart/form-data",
		authorization: `Bearer ${token}`,
	};
	axios
		.delete(url, {
			headers: headers,
		})
		.then((response) => {
			const modal = document.getElementById("delete-post-modal");
			const modalInstance = bootstrap.Modal.getInstance(modal);
			modalInstance.hide();
			showAlert("The Post Has Been Deleted Successfully", "success");
			getPosts();
		})
		.catch((error) => {
			const Emessage = error.response.data.message;
			showAlert(Emessage, "danger");
		});
}

function userClicked(userId) {
	window.location = `profile.html?userid=${userId}`;
}
function profileClicked() {
	const user = getCurrentUser();
	const userId = user.id;
	window.location = `profile.html?userid=${userId}`;
}
function toggleLoader(show = true) {
	if (show) {
		document.getElementById("loader").style.visibility = "visible";
	} else {
		document.getElementById("loader").style.visibility = "hidden";
	}
}
