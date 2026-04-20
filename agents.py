from langchain.agents import create_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from tools import web_search, web_scrape
import os
from dotenv import load_dotenv

load_dotenv()


#model setup 
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)

#1st agent serch agent
def build_research_agent():
    return create_agent(
        model=llm,
        tools=[web_search] 
    )


#2nd agent reader agent
def build_reader_agent():
    return create_agent(
        model=llm,
        tools=[web_scrape]
    )



#writer chain
writer_prompt = ChatPromptTemplate.from_messages([
        ("system", "you are an expert researcher writer . write clear structured and insightful reports"),
        ("user", """ write a detailed reserch report on the topic below.
        
 Topic: {topic}
        
Research Gathered:
{research}
        
structure the report as :
- Introduction
- Key findings (minimum 3 well- explained points)
- Conclusioon
- sources (List all the URLs found in the research)

Be detailed, factual and professional."""),               
])

writer_chain = writer_prompt | llm | StrOutputParser()


#critic chain 

critic_prompt = ChatPromptTemplate.from_messages([
    ("system", "you are a strict, sharp,constructive reasearch critic. review the report for accuracy, clarity, completeness and be honest and specific."),
    ("user", "Review the research report below and evaluate it strictly."
    """
    Report to review:
    {report}
    respond in this exact format:

    score: X/10

    strengths:
    - 
    - 
    - 

    weaknesses:
    - 
    - 
    - 

    overall evaluation:
    - 
    - 
    - 
    """)
])

critic_chain = critic_prompt | llm | StrOutputParser()