//
//
//
setupUI();
const baseUrl = "https://tarmeezacademy.com/api/v1";

//
//
//console.log(window.location.search);
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");
console.log(id);
setupUI();
getPost();

function getPost() {
	axios.get(`${baseUrl}/posts/${id}`).then((response) => {
		const post = response.data.data;
		console.log(post);
		const comments = post.comments;
		console.log(comments);
		//
		//
		const author = post.author;
		const img = post.image;

		//console.log(post);
		document.getElementById("usernameSpan").innerHTML = author.username;
		console.log(response.data);
		let postTitle = "";
		if (post.title !== null) {
			postTitle = post.title;
		}
		let commentContent = ``;
		for (comment of comments) {
			commentContent += `  <div class="p-3" style="background-color: #e8eaef;">
                <!--   profile pic and username  -->
                <div>
                    <img src="${comment.author.profile_image}" class="rounded-circle" style="width: 40px; height: 40px" alt="" />
                    <b>${comment.author.username}</b>
                </div>
                <!-- /  profile pic and username/  -->
                <!--  comment body -->
                <div>
                    ${comment.body}
                </div>

                <!-- /  comment body   /  -->
            </div>`;
		}
		const postContent = `
        <div class="card shadow">
						<div class="card-header">
							<img src="${author.profile_image}" class="rounded-circle border border-2" alt="" style="width: 40px; height: 40px" />
							<b>@${author.username}</b>
						</div>
						<div class="card-body">
							<img  src="${post.image}" class="w-100" style="height: 350px" alt="" />
							<h6 style="color: rgb(193, 193, 193)" class="mt-1">${post.created_at}</h6>
							<h5>${postTitle}</h5>
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
								<span>(${post.comments_count}) Comments</span>
							</div>
						</div>

					<div id="comments">
                        ${commentContent}
					</div>


					<div class="input-group mb-3" id="add-comment-div">
					<input id="comment-input" type="text" class="form-control" placeholder="add your comment here ..">
					<button class="btn btn-outline-primary" type="button" onclick="createcommentClicked()">Send</button>
					</div>
                    `;
		document.getElementById("Post").innerHTML = postContent;
	});
}
//
//
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
}

function loginBtnClicked() {
	const password = document.getElementById("password-input").value;
	const username = document.getElementById("username-input").value;
	const params = {
		username: username,
		password: password,
	};
	const url = `${baseUrl}/login`;
	axios.post(url, params).then((response) => {
		console.log(response.data.token);
		localStorage.setItem("token", response.data.token);
		localStorage.setItem("currentUser", JSON.stringify(response.data.user));
		const modal = document.getElementById("loginModal");
		const modalInstance = bootstrap.Modal.getInstance(modal);
		modalInstance.hide();
		showAlert("logged in successfully", "success");
		setupUI();
	});
}

function logout() {
	localStorage.removeItem("token");
	localStorage.removeItem("currentUser");
	showAlert("logged out successfully", "success");
	//alert("logged out successfully");
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

function getCurrentUser() {
	let user = null;
	const storageUser = localStorage.getItem("currentUser");
	if (storageUser != null) {
		user = JSON.parse(storageUser);
	}

	return user;
}

function createcommentClicked() {
	let commentbody = document.getElementById("comment-input").value;
	let params = {
		body: commentbody,
	};
	let token = localStorage.getItem("token");
	let url = `${baseUrl}/posts/${id}/comments`;

	axios
		.post(url, params, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		.then((response) => {
			showAlert("creat comment successfully", "success");

			getPost();
		})
		.catch((error) => {
			const errorMessage = error.response.data.message;
			showAlert(errorMessage, "danger");
		});
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
