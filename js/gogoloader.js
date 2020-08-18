//FE4A49  001730 4AD7D1

var $manga_url
var $anime_url

fetchAnimeEpisodes = async anime => {
	name = ""
	$manga_url = getMangaURL(anime)

	if (hasNumber(anime.title) || anime.title_english == null) {
		name = anime.title
	} else if (hasNumber(anime.title_english) || !anime.title_english.includes(":")) {
		name = anime.title_english
	} else if (anime.title_english.replace(/[a-zA-Z]/g,"").length == anime.title_japanese){
		name = anime.title_japanese
	} else {
		name = anime.title
	}
	
	console.log(name)

	getSearchResults(name).
	then (searchResults => {
		arr = searchResults[0].href.replace("-dub",'').split('/')
		$anime_url = "https://www.gogoanime.movie/"+ arr[arr.length -1] +"-episode-"
	}).
	catch(err => console.log(err))
}

getSearchResults = async name => {
	console.log(name)
	var results = ""
	await fetch ("https://cors-anywhere.herokuapp.com/https://www.gogoanime.movie//search.html?keyword="+name).
	then  (response => response.text()).
	then  (result   => {
		$("gogo-ghost").innerHTML = result.split("\n").slice(50).join("\n")
		console.log("done")
		results = $("wrapper_bg").children[1].children[0].children[0].children[1].children[0].children[0].children[1].children
	})

	return results
}

fetchAnimePage = async url => {
	path = url.split("/")
	var episodes
	 url = "https://cors-anywhere.herokuapp.com/https://www.gogoanime.movie/category/"+path[path.length - 1]
	 console.log(url)
	 await fetch (url).
	 then  (response => response.text()).
	 then  (result   => {
		  $("gogo-ghost").innerHTML = result.split("\n").slice(50).join("\n")
		  episodes = ($("episode_page").children.length - 1)*100
		  episodes += parseInt($("episode_page").children[$("episode_page").children.length - 1].children[0].getAttribute("ep_end")) - episodes	  
	 }).
	 catch (err => console.log(err))

	 return episodes
}

function hasNumber(myString) {
	return /\d/.test(myString);
}

expandAndShowEpisode = (el,episode) => {
  if (el.children.length == 0) {
	arr = $("gogo-ghost").loc.split("/")
	url = "https://cors-anywhere.herokuapp.com/https://www.gogoanime.movie/"+arr[arr.length-1]
	url += "-episode-"+episode

	fetch (url).
	then  (response => response.text()).
	then  (result   => {
	  str = result.split("\n")
	  url = ""
	  $("gogo-ghost").innerHTML = result.split("\n").slice(50).join("\n");

	  url = document.getElementsByClassName('anime_video_body_cate')[0].children[6].getAttribute("href").replace("download","streaming.php")

	  window.open(url)

	}).
	catch (err      => console.log(err))
  }
}

getMangaURL = anime => {
	if (urlParams["type"].toLowerCase() == 'anime') {
	  	name = anime.related.Adaptation[0].name.replace(/[^a-zA-Z0-9]/g,'-').toLowerCase()
		console.log(name)
		url = "http://www.mangapanda.com/"+name+"/";
		return url
	} else {
		var manga = anime
		console.log(manga)
		name = manga.title.replace(/[^a-zA-Z0-9]/g,'-').toLowerCase()
		console.log(name)
		url = "http://www.mangapanda.com/"+name+"/";
		return url
	}
}