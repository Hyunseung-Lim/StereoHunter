# StereoHunter

**StereoHunter** is an exploratory research probe that captures how real users identify and experience stereotypical biases in Large Language Models (LLMs).  
The system combines a React front-end with a lightweight Python back-end so that participants can actively elicit and examine stereotypes in real-time model interactions.

---

## 📑 Paper

> **How Do Users Identify and Perceive Stereotypes? Understanding User Perspectives on Stereotypical Biases in Large Language Models**  
> *The 2025 ACM Conference on Fairness, Accountability, and Transparency (FAccT ’25), Athens, Greece.*  
> DOI: [10.1145/3715275.3732207](https://doi.org/10.1145/3715275.3732207) – June 23–26, 2025

---

## 🗂️ Repository Layout

```text
stereoHunter/
├── client/   # React front end
└── server/   # Python back end
```
---

## 🚀 Quick Start

> **Tip:** Run each section in a separate terminal window for easier debugging.

### 1. Clone the repo

```bash
git clone https://github.com/your-org/stereoHunter.git
cd stereoHunter
```
### 2. Start the client (React)

```bash
cd client
npm install         # one-time dependency install
npm start           # runs on http://localhost:3000
```

### 3. Start the server (Python + Flask)

```bash
cd server
pip install -r requirements.txt   # ← make sure to run this first!
python main.py                    # runs on http://localhost:5000
```
Environment variables (optional)
Create a .env file in server/ to override defaults (e.g., OPENAI_API_KEY, PORT).

---

## 📊 Citation
```bibtex
@inproceedings{10.1145/3715275.3732207,
  author     = {Lim, Hyunseung and Choi, Dasom and Hong, Hwajung},
  title      = {How Do Users Identify and Perceive Stereotypes? Understanding User Perspectives on Stereotypical Biases in Large Language Models},
  year       = {2025},
  isbn       = {9798400714825},
  publisher  = {Association for Computing Machinery},
  address    = {New York, NY, USA},
  url        = {https://doi.org/10.1145/3715275.3732207},
  doi        = {10.1145/3715275.3732207},
  abstract   = {Stereotypical biases in large language models (LLMs) have the potential to result in discriminatory responses, posing harm to users and disrupting interactions. While prior research has predominantly focused on assessing stereotypes in LLMs with fairness metrics, there is a limited understanding of how users identify and perceive stereotypes in LLMs. To address this gap, we introduce StereoHunter, a research probe tool designed to examine how individuals identify and perceive stereotypes by observing interactions in which users elicit stereotypical responses from LLMs. Our findings reveal the nuanced considerations and challenges participants faced when evaluating these stereotypes, which varied based on their backgrounds and preconceptions about LLMs. Based on these insights, we discuss how diverse user perspectives can be reflected in identifying stereotypes and informing fairness metrics for mitigating biases in LLMs.},
  booktitle  = {Proceedings of the 2025 ACM Conference on Fairness, Accountability, and Transparency},
  pages      = {<pp.–pp.>},
  numpages   = {<n>},
  keywords   = {AI fairness, stereotype, algorithmic harms, large language model, human-AI interaction},
  location   = {Athens, Greece},
  series     = {FAccT '25}
}
```

## 📬 Contact
Questions or ideas? Reach out to Charlie at charlie9807@kaist.ac.kr.
