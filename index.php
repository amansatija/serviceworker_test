<?php
echo '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>';
echo '<script type ="text/javascript" src="app.js"></script>';
//echo '<link rel="stylesheet" href="main.css">';
echo "
<script>
  var ChromeSamples = {
    log: function() {
      var line = Array.prototype.slice.call(arguments).map(function(argument) {
        return typeof argument === 'string' ? argument : JSON.stringify(argument);
      }).join(' ');

      document.querySelector('#log').textContent += line ;
    },

    clearLog: function() {
      document.querySelector('#log').textContent = '';
    },

    setStatus: function(status) {
      document.querySelector('#status').textContent = status;
    },

    setContent: function(newContent) {
      var content = document.querySelector('#content');
      while(content.hasChildNodes()) {
        content.removeChild(content.lastChild);
      }
      content.appendChild(newContent);
    }
  };
</script>";

echo '<h3>Live Output</h3>
<div id="output" class="output">
  <div id="content">
<div id="commands" style="display: none">
  <div>
    <label for="url">Resource URL:</label>
    <input id="url" type="text" size="50" value="https://www.google.com/">
    <button id="add">Add to Cache</button>
    <button id="delete">Delete from Cache</button>
  </div>
  <div>
    <button id="list-contents">List Current Cache Contents</button>
  </div>
  <ul id="contents"></ul>
</div>
</div>
  <div id="status"></div>
  <pre id="log"></pre>
</div>
';
?>