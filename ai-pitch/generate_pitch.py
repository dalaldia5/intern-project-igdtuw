def generate_pitch_from_points(points):
    """
    Takes a list of bullet points and returns a full startup pitch.
    """

    intro = "Introducing our innovative solution:"
    body = ". ".join(points)
    closing = "With a passionate team and a strong vision, we are set to disrupt the industry."

    pitch = f"{intro}\n\n{body}.\n\n{closing}"
    return pitch

# Test
if __name__ == "__main__":
    test_points = [
        "AI-based pitch generation",
        "Real-time collaboration for teams",
        "User-friendly dashboard and task manager"
    ]
    print(generate_pitch_from_points(test_points))
