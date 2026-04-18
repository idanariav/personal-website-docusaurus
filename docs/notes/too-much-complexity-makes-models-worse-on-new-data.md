---
UUID: 20221014115702
Created: '2022-10-14 11:57'
Modified: '2026-04-11 22:28'
Version: 2
tags: []
aliases:
  - Overfitting
excalidraw-plugin: parsed
excalidraw-autoexport: png
Image: null
excalidraw-open-md: true
Description: >-
  A modeling flaw where increased complexity improves performance on training
  data but reduces accuracy on new data, often resulting from reliance on noise
  rather than true patterns.
new_schema: true
Topic:
  - '[[Data Science (Map)]]'
Origin: '[[Algorithms to Live By (book)]]'
URL: null
draft: false
SiteProcssed: true
---

# Overfitting

## Notes


### Claim

Overfitting is when we added complexity into our model such that it will have a better match to our train data, but this complexity only lowers our accuracy when the model encounters new data. Meaning that the model has overfitted it weights based on noise that should be ignored.

### Explanation

Overfitting is opposed to underfitting, which is the case where our model is too simplistic such that it didn't capture the causal relationship between the variables.

A good measure of over/under fitting is to split our data to train and test.
**An overfitted model will preform well on the train data, but will fail on the test,
An underfitted model will fail both the train and test data
and a good model will preform will in both.**

### Why it matters

We need to have pop quizzes that will test our knowledge in new situations and compare to our success on the "well known test".
Second of all, we need to notice the trend, and give weights to the history, and not change our opinion with every new piece of information.

### Examples

Overfitting is not limited to machine learning but also in real life. For example the [Goodhart's Law](/notes/goodharts-law.md) could be a result of overfitting. When we focus on the measure we fail to succeed in implementing our knowledge. For example, when we study for a test by repeating previous test questions, while failing when we would encounter new sets of questions.

### Supporters

### Opposers

### Open questions

## Visual

![Overfitting](/notes/overfitting.webp)
