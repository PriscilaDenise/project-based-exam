import logging
from typing import Optional
from .tmdb_service import TMDBService

logger = logging.getLogger(__name__)
class TimeMachineService:
    """Service to generate curated cinematic 'Time Capsules' for a specific year."""
    
    OSCAR_BEST_PICTURES = {
        1927: "Wings", 1928: "The Broadway Melody", 1929: "All Quiet on the Western Front",
        1930: "Cimarron", 1931: "Grand Hotel", 1932: "Cavalcade", 1933: "It Happened One Night",
        1934: "Mutiny on the Bounty", 1935: "The Great Ziegfeld", 1936: "The Life of Emile Zola",
        1937: "You Can't Take It with You", 1938: "Gone with the Wind", 1939: "Rebecca",
        1940: "How Green Was My Valley", 1941: "Mrs. Miniver", 1942: "Casablanca",
        1943: "Going My Way", 1944: "The Lost Weekend", 1945: "The Best Years of Our Lives",
        1946: "Gentleman's Agreement", 1947: "Hamlet", 1948: "All the King's Men",
        1949: "All About Eve", 1950: "An American in Paris", 1951: "The Greatest Show on Earth",
        1952: "From Here to Eternity", 1953: "On the Waterfront", 1954: "Marty",
        1955: "Around the World in 80 Days", 1956: "The Bridge on the River Kwai",
        1957: "Gigi", 1958: "Ben-Hur", 1959: "The Apartment", 1960: "West Side Story",
        1961: "Lawrence of Arabia", 1962: "Tom Jones", 1963: "My Fair Lady",
        1964: "The Sound of Music", 1965: "A Man for All Seasons", 1966: "In the Heat of the Night",
        1967: "Oliver!", 1968: "Midnight Cowboy", 1969: "Patton", 1970: "The French Connection",
        1971: "The Godfather", 1972: "The Sting", 1973: "The Godfather Part II",
        1974: "One Flew Over the Cuckoo's Nest", 1975: "Rocky", 1976: "Annie Hall",
        1977: "The Deer Hunter", 1978: "Kramer vs. Kramer", 1979: "Ordinary People",
        1980: "Chariots of Fire", 1981: "Gandhi", 1982: "Terms of Endearment",
        1983: "Amadeus", 1984: "Out of Africa", 1985: "Platoon", 1986: "The Last Emperor",
        1987: "Rain Man", 1988: "Driving Miss Daisy", 1989: "Dances with Wolves",
        1990: "The Silence of the Lambs", 1991: "Unforgiven", 1992: "Schindler's List",
        1993: "Forrest Gump", 1994: "Braveheart", 1995: "The English Patient",
        1996: "Titanic", 1997: "Shakespeare in Love", 1998: "American Beauty",
        1999: "Gladiator", 2000: "A Beautiful Mind", 2001: "Chicago",
        2002: "The Lord of the Rings: The Return of the King", 2003: "Million Dollar Baby",
        2004: "Crash", 2005: "The Departed", 2006: "No Country for Old Men",
        2007: "Slumdog Millionaire", 2008: "The Hurt Locker", 2009: "The King's Speech",
        2010: "The Artist", 2011: "Argo", 2012: "12 Years a Slave", 2013: "Birdman",
        2014: "Spotlight", 2015: "Moonlight", 2016: "The Shape of Water",
        2017: "Green Book", 2018: "Parasite", 2019: "Nomadland", 2020: "CODA",
        2021: "Everything Everywhere All at Once", 2022: "Oppenheimer"
    }
    
     GLOBAL_EVENTS = {
        1927: ["Charles Lindbergh completes first solo flight across Atlantic", "Work begins on Mount Rushmore"],
        1939: ["World War II begins in Europe", "First commercial helicopter flight"],
        1945: ["World War II ends", "World Bank and IMF created"],
        1969: ["Apollo 11: Man walks on the Moon", "Woodstock festival defines a generation"],
        1977: ["First Apple II personal computers go on sale", "Elvis Presley passes away"],
        1989: ["Berlin Wall falls", "World Wide Web proposal is written by Tim Berners-Lee"],
        1994: ["Nelson Mandela inaugurated as President of South Africa", "Channel Tunnel opens"],
        1999: ["Introduction of the Euro currency", "Y2K anxiety grips the world"],
        2001: ["Launch of Wikipedia", "First tourist in space"],
        2008: ["Barack Obama elected first Black US President", "Global financial crisis"],
        2023: ["Global population hits 8 billion", "Rise of generative AI transforms industry"]
    }

    def __init__(self):
        self.tmdb = TMDBService()

    def get_year_capsule(self, year: int) -> dict:
        """Fetch and categorize enriched movies for a specific year."""
        
        popular_data = self.tmdb.discover_movies(
            primary_release_year=year,
            sort_by="popularity.desc",
            page=1
        )
        popular_results = popular_data.get("results", [])

        titan = popular_results[0] if popular_results else None
        
        critics_data = self.tmdb.discover_movies(
            primary_release_year=year, sort_by="vote_average.desc", **{"vote_count.gte": 500}
        )
        critics = critics_data.get("results", [None])[0]

        # Fetch Oscar Winner
        oscar_movie = None
        oscar_title = self.OSCAR_BEST_PICTURES.get(year)
        if oscar_title:
            search = self.tmdb.search_movies(oscar_title)
            results = search.get("results", [])
            for r in results:
                if str(year) in r.get("release_date", ""):
                    oscar_movie = r
                    break