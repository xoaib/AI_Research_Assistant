from agents import build_research_agent, build_reader_agent, writer_chain, critic_chain

def run_research_pipeline(topic: str) -> dict:
    
    state ={}



    #search agent working
    print("\n"+"="*50)
    print("Research Agent working")
    print("="*50)

    research_agent = build_research_agent()
    search_result = research_agent.invoke({
        "messages" :[("user",f"Find recent, reliable and detailed information about:{topic}")]
    })
    state["search_results"] = search_result['messages'] [-1].content
    printv("\n search result",state['search_results'])