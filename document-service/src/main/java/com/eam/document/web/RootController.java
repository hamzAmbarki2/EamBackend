package com.eam.document.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {
	@GetMapping({"/", "/api", "/api/"})
	public String index() {
		return "redirect:/swagger-ui.html";
	}
}