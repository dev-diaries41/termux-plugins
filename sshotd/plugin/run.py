import os

# Path to the state file
STATE_FILE = "./plugin/state.txt"

# Default values
DEFAULT_THRESHOLD = 2
DEFAULT_COUNTER = 0

def read_state():
    """
    Reads the state file to get the current counter and threshold.
    If the file doesn't exist, it creates one with default values.
    """
    if not os.path.exists(STATE_FILE):
        # Create the file with default values if missing
        with open(STATE_FILE, "w") as f:
            f.write(f"COUNTER={DEFAULT_COUNTER}\nTHRESHOLD={DEFAULT_THRESHOLD}\n")
        return DEFAULT_COUNTER, DEFAULT_THRESHOLD
    
    counter, threshold = DEFAULT_COUNTER, DEFAULT_THRESHOLD
    with open(STATE_FILE, "r") as f:
        for line in f:
            if line.startswith("COUNTER"):
                counter = int(line.split("=")[1].strip())
            elif line.startswith("THRESHOLD"):
                threshold = int(line.split("=")[1].strip())
    return counter, threshold

def write_state(counter, threshold):
    """
    Writes the updated counter and threshold to the state file.
    """
    with open(STATE_FILE, "w") as f:
        f.write(f"COUNTER={counter}\nTHRESHOLD={threshold}\n")

def main():
    # Load current state
    counter, threshold = read_state()

    # Increment the counter
    counter += 1

    # Check if the threshold is reached
    if counter >= threshold:
        print(f"Number of screenshots reached: {counter}.")
        # Reset the counter
        counter = 0
    else:
        print(f"New screenshot detected. Current count: {counter}")

    # Save the updated state
    write_state(counter, threshold)

if __name__ == "__main__":
    main()
