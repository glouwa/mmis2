function onload()
{
  $('div.right')[0].style.backgroundColor = '#4CAF50';
  addTagToTagCloud('Hallo Pandi!', 0.7);
  addTagToTagCloud('Hallo Pandi!', 0.2);
  addTagToTagCloud('Hallo Pandi!', 0.7);
  addTagToTagCloud('Hallo Pandi!', 0.2);
  addTagToTagCloud('Hallo Pandi!', 0.7);
  addTagToTagCloud('Hallo Pandi!', 0.2);

  $(function() {
    var availableTags = [
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];
    $( "#tags" ).autocomplete({
      source: availableTags
    });
  });

}




function addTagToTagCloud(tagName, tagWeight)
{
    var tag = document.createElement('span');
    tag.innerHTML = tagName;
    tag.style.fontSize = 1 + (2 * tagWeight) + 'em';
    console.log(tag.style.fontSize);
    $('div.left')[0].appendChild(tag); // native html
    //$('div.left').append(tag);    // jquery
}
