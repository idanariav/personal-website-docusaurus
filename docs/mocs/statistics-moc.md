---
UUID: 20230324124543
Created: '2023-03-24 12:45'
Modified: '2024-03-23 09:46'
Version: 1.01
tags: []
Up: '[[Home]]'
draft: false
SiteProcssed: true
---

# Statistics

## Notes

Statistics is the method of measuring the validity and accuracy of our data. This helps us understand not only what are the traits of our data (for example what is the average height of the population), but also estimate how much of our sample is similar to the population.

### Common Problems
Common issues we might face while analyzing our data, specifically those who challenge the validity of our finding:
1. [Correlation is not causation](/notes/correlation-is-not-causation.md) - [Correlation](/notes/correlation.md) between variables doesn't indicate a causal link
2. [Garbage in garbage out](/notes/garbage-in-garbage-out.md) - A model is only as good as the inputs provided
3. [Skewness](/notes/skewness.md) - The data is not evenly distributed across possible values.
4. [Bias and Variance](/notes/bias-and-variance.md) - Our results might either be biased, with high variance, or both.
### Similarity

Most of statistical tests require an hypothesis ([Hypothesis Testing](/notes/hypothesis-testing.md) ), meaning that we make an inference on our data (for example - group x and group y have similar distributions), and we compare the results to see if the hypothesis holds true or should it be rejected. Note that an hypothesis can only be disproven (and not proven).

we compare [Population and sample estimates](/notes/population-and-sample-estimates.md) by using [P Value](/notes/p-value.md), which helps us measure how rare are the results we have. The lower the P value, the less chance that we got a significant difference "by mistake". We can also create [Confidence Interval](/notes/confidence-interval.md) to see what are the likelihood of the actual value to be within certain values. For example, a 90% chance that the value is between 1 - 1.5.

### Distribution

A good measure of a distribution of a variable across a sample is to use [Histograms](/notes/histograms.md). This would also show us which [Statistical Distribution](/notes/statistical-distribution.md) the variable has. No matter which distribution it has, if we do repeated sampling ([bootstrapping](/notes/bootstrapping.md) ), than according to the [central limit theorem](/notes/central-limit-theorem.md) , we will have a normal distribution for the sample means, which gives us confidence that our random sample is a good representation of the entire population. Another contributing factor is [Regression towards the mean](/notes/regression-towards-the-mean.md), that given a large enough sample data, we would expect to see values center around the mean.

### Probability
While the world is full of [Randomness](/notes/randomness.md) , we can still calculate the probabilities of events happening. Note that it is worth distinguishing between [Probability vs Likelihood](/notes/probability-vs-likelihood.md) , and consider how probability changes once we acquire new information, or consider the context of the probability ([conditional probability](/notes/conditional-probability.md) )

### Books
[Calling Bullshit (book)](/books/calling-bullshit-book.md)

### Youtube
[StatQuest](/notes/statquest.md)

### Courses
[Statistics for Data Science (course)](/notes/statistics-for-data-science-course.md)

## Other MOC

### Overview
