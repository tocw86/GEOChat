!function(){var a=io;function i(e,t,s){vNotify[e]({text:t,title:s,sticky:!0})}io=null,document.getElementById("marker-holder").addEventListener("click",function(e){if("BUTTON"===e.target.tagName){var t=e.target.getAttribute("data-marker");if(null!=t&&""!=t&&-1<["red","green","blue"].indexOf(t)){var s=a.connect("http://geochat.pl:3000");s.on("console",function(e){if(e){var t=document.getElementById("bottom_loader");t.classList.remove("d-b"),t.classList.add("d-n");var s=document.getElementById("status_toolbar");s.classList.remove("d-n"),s.classList.add("d-b");var a=document.getElementById("chevron_pull");a.classList.remove("up"),a.classList.add("down"),a.innerHTML="";var n=document.createElement("i");n.setAttribute("class","fas fa-angle-up"),a.appendChild(n),document.getElementById("c_center").classList.add("d-n"),document.getElementById("m_container").innerHTML="";var d=document.createElement("div");d.innerHTML='<textarea rows="10" data-role="textarea" data-auto-size="true" data-max-height="400" data-prepend="<span class=\'mif-bubbles\'></span>">Hello: '+e+"</textarea>",document.getElementById("m_container").appendChild(d),i("success","Connected","Status")}else i("error","Disconnected","Status")}),new Init(s,t),document.getElementById("bottom_div").classList.remove("d-b"),document.getElementById("bottom_div").classList.add("d-n"),document.getElementById("map").classList.remove("bg")}}}),document.getElementById("chevron_pull").addEventListener("click",function(){var e,t=document.getElementById("bottom_div");t.classList.contains("show")?(this.innerHTML="",(e=document.createElement("i")).setAttribute("class","fas fa-angle-up"),this.appendChild(e),t.classList.remove("show"),t.classList.remove("d-b"),t.classList.add("hide"),t.classList.add("d-n"),this.classList.remove("up"),this.classList.add("down")):(this.innerHTML="",(e=document.createElement("i")).setAttribute("class","fas fa-angle-down"),this.appendChild(e),t.classList.remove("hide"),t.classList.remove("d-n"),t.classList.add("show"),t.classList.add("d-b"),this.classList.remove("down"),this.classList.add("up"))})}();