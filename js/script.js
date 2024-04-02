document.addEventListener('DOMContentLoaded', function() {
  const navbarToggler = document.getElementById('navbarToggle');
  const collapsableNav = document.getElementById('collapsable-nav');

  navbarToggler.addEventListener('blur', function(event) {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      collapsableNav.classList.remove('show');
    }
  });

  navbarToggler.addEventListener('click', function(event) {
    event.target.focus();
  });
});

(function(global) {
  var dc = {};

  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";

  var insertHtml = function(selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  var showLoading = function(selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  var insertProperty = function(string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  };

  var switchMenuToActive = function() {
    classes = document.querySelector("#navHomeButton").classList;
    classes.remove("active");

    classes = document.querySelector("#navMenuButton").classList;
    if (!classes.contains("active")) {
      classes.add("active");
    }
  };

  document.addEventListener("DOMContentLoaded", function(event) {
    showLoading("#main-content");
    fetch(homeHtml)
      .then(function(response) {
        return response.text();
      })
      .then(function(responseText) {
        document.querySelector("#main-content").innerHTML = responseText;
      });
  });

  dc.loadMenuCategories = function() {
    showLoading("#main-content");
    fetch(allCategoriesUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(categories) {
        buildAndShowCategoriesHTML(categories);
      });
  };

  dc.loadMenuItems = function(categoryShort) {
    showLoading("#main-content");
    fetch(menuItemsUrl + categoryShort + ".json")
      .then(function(response) {
        return response.json();
      })
      .then(function(menuItems) {
        buildAndShowMenuItemsHTML(menuItems);
      });
  };

  function buildAndShowCategoriesHTML(categories) {
    fetch(categoriesTitleHtml)
      .then(function(response) {
        return response.text();
      })
      .then(function(categoriesTitleHtml) {
        fetch(categoryHtml)
          .then(function(response) {
            return response.text();
          })
          .then(function(categoryHtml) {
            switchMenuToActive();

            var categoriesViewHtml = buildCategoriesViewHtml(
              categories,
              categoriesTitleHtml,
              categoryHtml
            );
            insertHtml("#main-content", categoriesViewHtml);
          });
      });
  }

  function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    for (var i = 0; i < categories.length; i++) {
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  function buildAndShowMenuItemsHTML(categoryMenuItems) {
    fetch(menuItemsTitleHtml)
      .then(function(response) {
        return response.text();
      })
      .then(function(menuItemsTitleHtml) {
        fetch(menuItemHtml)
          .then(function(response) {
            return response.text();
          })
          .then(function(menuItemHtml) {
            switchMenuToActive();

            var menuItemsViewHtml = buildMenuItemsViewHtml(
              categoryMenuItems,
              menuItemsTitleHtml,
              menuItemHtml
            );
            insertHtml("#main-content", menuItemsViewHtml);
          });
      });
  }

  function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
    menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
    menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);

    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row'>";

    var menuItems = categoryMenuItems.menu_items;
    var catShortName = categoryMenuItems.category.short_name;
    for (var i = 0; i < menuItems.length; i++) {
      var html = menuItemHtml;
      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertItemPrice(html, "price_small", menuItems[i].price_small);
      html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
      html = insertItemPrice(html, "price_large", menuItems[i].price_large);
      html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
      html = insertProperty(html, "name", menuItems[i].name);
      html = insertProperty(html, "description", menuItems[i].description);

      if (i % 2 != 0) {
        html += "<div class='clearfix d-none d-lg-block'></div>";
      }

      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  function insertItemPrice(html, pricePropName, priceValue) {
    if (!priceValue) {
      return insertProperty(html, pricePropName, "");
    }

    priceValue = "$" + priceValue.toFixed(2);
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }

  function insertItemPortionName(html, portionPropName, portionValue) {
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    }

    portionValue = "(" + portionValue + ")";
    html = insertProperty(html, portionPropName, portionValue);
    return html;
  }

  global.$dc = dc;
})(window);