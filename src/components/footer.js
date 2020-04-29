import React from "react";

class Footer extends React.Component {
	render() {
		let copyright = "Woofly © 2020";
		
		let date = new Date();
		let currentYear = date.getFullYear();
		if(currentYear !== 2020) {
			copyright += " - " + currentYear;
		}
		
		copyright += ", Mike Ward";
		
		return(
			<footer>
				<p className='copyright'>{copyright}</p>
			</footer>
		)
	}
}

export default Footer;