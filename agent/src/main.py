import argparse
from services.agent_runner import run_once, run_forever

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--once", action="store_true", help="run once and exit")
    args = parser.parse_args()

    if args.once:
        return run_once()
    
    return run_forever()

if __name__ == "__main__":
    raise SystemExit(main())
