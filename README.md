# Mask.js

A simple javascript library for masking image using the image mask.
##[ Demo ](http://codepen.io/kshitiztiwari/full/zHvjo/)

##Usage
```
document.addEventListener("DOMContentLoaded", function(event) {
	Mask({
		/* 
			Image id 
			* Required Field
		*/
		"id" : "image",

		/* 	
			Mask Image source 
			* Required Field
		*/
		"mask" : "https://dl.dropboxusercontent.com/u/15246667/mask.jpg",

		/* 	Boolean : 	true for greyscale mask
			Default : true
		*/
		"confidence" : false
	});
});
```