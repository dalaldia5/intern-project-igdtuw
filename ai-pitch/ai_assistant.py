def get_next_steps(idea):
    """
    Takes a startup idea and returns a step-by-step plan for execution.
    """

    return f"""Based on your idea: "{idea}", here are the suggested next steps:

1. Clearly define the problem you are solving.
2. Identify your target audience and their pain points.
3. Conduct market and competitor research.
4. Create wireframes or a basic prototype.
5. Validate the idea through feedback or surveys.
6. Develop a Minimum Viable Product (MVP).
7. Launch to a small group and iterate based on feedback.
8. Start building your brand and pitch for funding (if needed)."""

# Test
if __name__ == "__main__":
    test_idea = "An AI assistant for guiding startup teams through hackathons"
    print(get_next_steps(test_idea))
