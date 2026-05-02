from agents import build_research_agent, build_reader_agent, writer_chain, critic_chain

def run_research_pipeline(topic: str) -> dict:
    
    state ={}



    #search agent working
    print("\n"+"="*50)
    print("Research Agent working")
    print("="*50)

    research_agent = build_research_agent()
    search_result = research_agent.invoke({
        "input": f"Find recent, reliable and detailed information about: {topic}"
    })
    state["search_results"] = search_result['output']
    print("\n search result",state['search_results'])       


    # step 2 reader agent 
    print("\n"+"="*50)
    print("Reader Agent Scanning websites...")
    print("="*50)

    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke({
        "input": (
            f"based on the following search results about '{topic}',"
            f"identify the most relevant and high-quality URL and scrape it for deeper content.\n\n"
            f"Search Results:\n{state['search_results'][:800]}"
        )
    })
    state['scraped_content'] = reader_result['output']
    print("\n Scraped Content :",state['scraped_content'])



    #step3 writer chain

    print("\n"+"="*50)
    print("Writer Agent working...")
    print("="*50)


    research_combined = (
         f"SEARCH RESULT :\n {state['search_results']} \n\n"
         f"DETAILED SCRAPED CONTENT :\n{state['scraped_content']}"
    )


    state["report"] = writer_chain.invoke({
        "topic" :topic,
        "research" :research_combined
    })


    #critic chain
    print("\n"+"="*50)
    print("Critic Agent working...")
    print("="*50)

    state["feedback"] = critic_chain.invoke({
        "report":state["report"]
    })

    print("\n critic report\n", state['feedback'])


    return state



if __name__ == "__main__":
    topic = input("\n Enter Topic : ")
    run_research_pipeline(topic)
    


    
  
