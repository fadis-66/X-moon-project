setupUI();
getUser();
getPosts();
function getUser() {
	const id = getCurrentUserId();
	axios.get(`${baseUrl}/users/${id}`).then((response) => {
		//	console.log(response.data);
		const user = response.data.data;
		document.getElementById("main-info-email").innerHTML = user.email;
		document.getElementById("main-info-name").innerHTML = user.name;
		document.getElementById("main-info-username").innerHTML = user.username;
		document.getElementById("postsCount").innerHTML = user.posts_count;
		document.getElementById("commentCount").innerHTML = user.comments_count;
		document.getElementById("main-info-image").src = user.profile_image;
		document.getElementById("name-posts").innerHTML = user.username;
	});
}
function getCurrentUserId() {
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get("userid");
	return id;
}
function getPosts() {
	const id = getCurrentUserId();
	axios.get(`${baseUrl}/users/${id}/posts`).then((response) => {
		const posts = response.data.data;
		//	console.log(posts);
		document.getElementById("user-posts").innerHTML = "";
		for (post of posts) {
			const author = post.author;
			let postTitle = ``;
			//
			//
			//show or hide edit user
			let user = getCurrentUser();
			let isMyPost = user != null && post.author.id == user.id;
			//
			//console.log(isMyPost);
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
							<span onclick="userClicked()" ><img src="${author.profile_image}" class="rounded-circle border border-2" alt="" style="width: 40px; height: 40px" />
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
				document.getElementById("user-posts").innerHTML += content;
			}
		}
	});
}
/*
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
*/
function profileClicked() {
	const user = getCurrentUser();
	const userId = user.id;
	window.location = `profile.html?userid=${userId}`;
}
function logout() {
	localStorage.removeItem("token");
	localStorage.removeItem("currentUser");
	showAlert("logged out successfully", "success");
	window.location = "index.html";
	setupUI();
}
