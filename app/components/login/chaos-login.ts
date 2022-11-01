import AuthService from "../../services/auth-service/index";

export class ChaosLogin extends HTMLElement {
	get username(): HTMLInputElement {
		return <HTMLInputElement>this.querySelector("#username");
	}

	get password(): HTMLInputElement {
		return <HTMLInputElement>this.querySelector("#password");
	}

	get errors(): HTMLLabelElement {
		return <HTMLLabelElement>this.querySelector("#errors");
	}

	onClick(e: MouseEvent) {
		e.preventDefault();
		AuthService.authenticate(this.username?.value, this.password?.value).then(
			(msg) => (this.errors.innerText = msg)
		);
	}

	render() {
		this.innerHTML = `
			<label for="username">Username:</label>
			<input
				id="username"
				name="username"
				autocomplete="username"
				type="text"
			/>
			<label for="password">Password:</label>
			<input
				id="password"
				name="password"
				autocomplete="password"
				type="password"
			/>
			<button type="button">Login</button>
			<label id="errors"></label>`;
	}

	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
		this.addEventListener("click", (e: MouseEvent) => this.onClick(e), false);
	}

	disconnectedCallback() {
		this.removeEventListener(
			"click",
			(e: MouseEvent) => this.onClick(e),
			false
		);
	}
}
