// Get vaccine data
fetch("https://disease.sh/v3/covid-19/vaccine")
  .then((response) => response.json())
  .then((data) => {
    // Main data data.data stored in variable
    let mainData = data.data;

    console.log(data);
    console.log(mainData);

    let candidates = document.querySelector(".total-candidates");
    candidates.innerHTML = `Total Candidates: ${data.totalCandidates}`;

    // main data for cards
    let vacDiv = document.querySelector("#vaccine-data");
    vacDiv.innerHTML = mainData.map(
      (element) => `
      
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">${element.candidate}</h4>
          <h6 class="card-subtitle text-muted">Support card subtitle</h6>
          <p class="card-text py-1 small show-read-more text-center">
            ${element.details}
          </p>
          
        </div>
      </div>
    </div>`
    );
  });

$(document).ready(function () {
  var maxLength = 260;
  $(".show-read-more").each(function () {
    var myStr = $(this).text();
    if ($.trim(myStr).length > maxLength) {
      var newStr = myStr.substring(0, maxLength);
      var removedStr = myStr.substring(maxLength, $.trim(myStr).length);
      $(this).empty().html(newStr);
      $(this).append(
        ' <a href="javascript:void(0);" class="read-more">read more...</a>'
      );
      $(this).append('<span class="more-text">' + removedStr + "</span>");
    }
  });
  $(".read-more").click(function () {
    $(this).siblings(".more-text").contents().unwrap();
    $(this).remove();
  });
});
