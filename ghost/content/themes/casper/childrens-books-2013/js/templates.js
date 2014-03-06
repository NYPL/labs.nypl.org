(function(){ window.JST || (window.JST = {}) 
window.JST["book_modal"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="modal-header">\n    <!-- <a class="hide npr-logo" href="http://npr.org/books/"><img src="http://media.npr.org/chrome/books/npr-books-logo-color.png" alt="NPR Books" /></a> -->\n    <a href="#" class="hide mobile-dismiss" data-dismiss="modal" aria-hidden="true"><i class="icon-chevron-left"></i> Back to NYPL&rsquo;s Children&rsquo;s Books</a>\n    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n</div>\n\n<div class="modal-body">\n    <div class="row">\n        <div class="modal-book-cover col-md-5">\n            <img id="book-image" src="img/cover/'+
( book.slug )+
'';
 if (SMALL_MOBILE) { 
;__p+='-thumb';
 } 
;__p+='.jpg" alt="'+
( book.title )+
'"/>\n        </div>\n\n        <div class="modal-text col-md-7">\n            <h4 class="modal-title" id="myModalLabel">'+
( book.title )+
'</h4>\n            ';
 if(book.author) { 
;__p+='<p class="author">By <a style="color:#999; text-decoration: underline;" href="http://nypl.bibliocommons.com/search?t=author&q='+
(book.author)+
'&commit=Search&searchOpt=catalogue">'+
( book.author)+
'</a>';
if(book.illustrator){
;__p+='. Illustrated by '+
( book.illustrator )+
'';
}
;__p+='</p>';
}
;__p+='\n            ';
 if(book.genre) { 
;__p+='<p class="genre"><strong>'+
( COPY.content.genre )+
' </strong>'+
( book.genre )+
'</p> ';
 } 
;__p+='\n\n            <!-- Tags -->\n            ';
 if(book.tags.length > 0) { 
;__p+='<p class="tags"><strong>'+
( COPY.content.tag_list )+
' </strong>';
 _.each(book.tags, function(tag, index, list){ 
;__p+='\n                <a\n                    class="btn btn-large btn-info tag"\n                    href="#/tag/'+
( tag )+
'">'+
( COPY.tags[tag] )+
'\n                </a>\n            ';
 }); 
;__p+='</p> ';
 } 
;__p+='\n\n            <!-- Book Description/Review -->\n            ';
 if(book.text) { 
;__p+='<p class="text">'+
( book.text )+
'</p> ';
 } 
;__p+='\n            ';
 if(book.reviewer) { 
;__p+='<p class="reviewer">&mdash; '+
( COPY.content.recommended_by )+
' <strong>';
 if (book['reviewer link']) { 
;__p+='<a href="'+
( book['reviewer link'] )+
'" target="_blank">'+
( book.reviewer )+
'</a>';
 } else { 
;__p+=''+
( book.reviewer )+
'';
 } 
;__p+='</strong>';
 if (book['reviewer ID']) { 
;__p+=', '+
( book['reviewer ID'] )+
'';
 } 
;__p+='</p> ';
 } 
;__p+='\n\n            <!-- Purchase/Related Links -->\n\n            <p class="book-modal-links">\n                ';
 if(book.text) { 
;__p+='\n                  ';
 if(book.catalog_uri) { 
;__p+='\n                    <a href="'+
(book.catalog_uri)+
'" target="_blank" class="purchase-link"><i></i> Check Out This Book!</a>\n                  ';
 } else { 
;__p+='\n                    <a href="http://nypl.bibliocommons.com/item/show/'+
( book.biblio_id )+
'" target="_blank" class="purchase-link"><i></i> Check Out This Book!</a>\n                  ';
 } 
;__p+='\n                ';
 } 
;__p+='\n                ';
 if(book.ebook) { 
;__p+='\n                    <a href="'+
(book.ebook)+
'" target="_blank" class="purchase-link"><i></i> Read Ebook!</a>\n                ';
 } 
;__p+='\n            </p>\n\n            <ul>\n                ';
 if (book.review_seamus_id){  
;__p+='\n                <li class="review_seamus_id book-modal-links">\n                <a href="http://npr.org/'+
( book.review_seamus_id )+
'" target="_blank"><strong>'+
( COPY.content.npr_review_link )+
'</strong> '+
( book.review_seamus_headline )+
'</a>\n                </li>\n                ';
 } 
;__p+='\n\n                ';
 if (book.author_seamus_id){  
;__p+='\n                <li class="author_seamus_id book-modal-links">\n                    <a href="http://npr.org/'+
( book.author_seamus_id )+
'" target="_blank">\n                        <strong>'+
( COPY.content.npr_author_link )+
'</strong>\n                        ';
 if (book.author_seamus_headline) { 
;__p+='\n                            '+
( book.author_seamus_headline )+
'\n                        ';
 } else { 
;__p+='\n                            '+
( book.author )+
'\n                        ';
 } 
;__p+='\n                    </a>\n                </li>\n                ';
 } 
;__p+='\n            </ul>\n\n        </div>\n    </div>\n</div>\n\n<div class="modal-footer">\n\n    ';
 if (previous != null){  
;__p+='\n    <a href="#/book/'+
( previous )+
'" class="btn btn-default modal-nav-buttons" id="previous-book">PREVIOUS BOOK</a>\n    ';
 } 
;__p+='\n\n    ';
 if (next != null){  
;__p+='\n    <a href="#/book/'+
( next )+
'" class="btn btn-default modal-nav-buttons" id="next-book">NEXT BOOK</a>\n    ';
 } 
;__p+='\n    <button type="button" class="btn btn-default" id="modal-close-btn" data-dismiss="modal">Close</button>\n\n</div>\n';
}
return __p;
};

})();