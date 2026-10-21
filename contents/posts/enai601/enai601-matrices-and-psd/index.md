---
title: "[ENAI601] 02 — 행렬에서 PSD까지, 고유값으로 읽는 이차형식"
description: "9월 9일 선형대수 복습: 행렬 곱을 열의 선형결합으로 읽고 range·null space·rank·역행렬·행렬식·고유값을 거쳐 PSD와 최적화로 연결한다."
date: 2026-10-21
tags:
  - ENAI601
  - linear-algebra
  - optimization
series: "ENAI601"
seriesOrder: 2
---

벡터를 공부할 때 내적은 방향의 관계를, 정사영은 부분공간 안에서 가장 가까운 표현을 알려 주었다. 행렬은 이 벡터들을 다른 벡터로 보내는 규칙이다. **그 규칙이 어떤 방향을 살리고, 어떤 방향을 없애며, 방향마다 어떤 배율을 주는가?** 이 질문으로 행렬을 보면 rank와 고유값, positive semidefinite가 연결된다.

이 글은 <strong>2026년 9월 9일 수업 캡션과 Module 1 — Linear Algebra 교안</strong>을 바탕으로 작성했다. [앞 글의 벡터·정사영](/enai601-vectors-and-projection/)과 개인 필기에서 먼저 등장했던 행렬 곱·이차형식도 이어 붙였다. 수업 내용을 재구성한 학습 기록이며, 작은 계산 예제와 최소제곱 연결은 이해를 위한 보충 설명이다.

| 개념 | 확인하려는 것 |
| --- | --- |
| 행렬 곱 | 열벡터를 어떤 계수로 조합하는가? |
| range / null space | 가능한 출력과 사라지는 입력은 무엇인가? |
| rank / 역행렬 | 독립적인 출력 방향은 몇 개이고 되돌릴 수 있는가? |
| 행렬식 / 고유값 | 부피와 특정 방향의 배율은 어떻게 변하는가? |
| 대칭행렬 / PSD | 이차형식이 모든 방향에서 음수가 아닌가? |

## 1. 행렬 곱은 내적이면서 열벡터의 선형결합이다

행렬의 크기를 쓸 때 첫 수는 행의 개수, 두 번째 수는 열의 개수다.

$$
A\in\mathbb R^{m\times n},\qquad x\in\mathbb R^n,\qquad Ax\in\mathbb R^m
$$

입력 성분은 n개, 출력 성분은 m개다. 행렬 곱의 안쪽 크기가 같아야 하는 이유다. 교안의 예제를 계산해 보자.

$$
A=\begin{bmatrix}3&1&2\\5&4&7\end{bmatrix},\qquad
x=\begin{bmatrix}4\\3\\1\end{bmatrix}
$$

행 관점에서는 각 행과 x의 내적이다.

$$
Ax=\begin{bmatrix}3\cdot4+1\cdot3+2\cdot1\\5\cdot4+4\cdot3+7\cdot1\end{bmatrix}
=\begin{bmatrix}17\\39\end{bmatrix}
$$

열 관점에서는 A의 열벡터들을 x의 성분으로 가중합한다.

$$
Ax=4\begin{bmatrix}3\\5\end{bmatrix}
+3\begin{bmatrix}1\\4\end{bmatrix}
+1\begin{bmatrix}2\\7\end{bmatrix}
=\begin{bmatrix}17\\39\end{bmatrix}
$$

수업에서 강조한 것은 이 두 번째 해석이다. <strong>행렬에 벡터를 곱한다는 것은 열벡터들의 선형결합을 만든다는 뜻</strong>이다. 입력 벡터가 그 조합의 계수를 정한다.

행렬끼리의 곱도 같다. C의 각 열을 하나씩 입력으로 넣으면 AC의 각 열이 된다.

$$
A\in\mathbb R^{m\times n},\quad C\in\mathbb R^{n\times p}
\quad\Longrightarrow\quad AC\in\mathbb R^{m\times p}
$$

$$
(AC)_{ij}=\sum_{k=1}^n a_{ik}c_{kj}
$$

곱의 순서도 의미가 있다. AC는 먼저 C, 다음 A를 적용하는 합성이다. 일반적으로 AC와 CA는 다르며, 한쪽만 정의될 수도 있다.

## 2. 선형변환: 덧셈과 스칼라배를 보존한다

행렬 A로 정의한 변환은 선형이다.

$$
A(\alpha x+\beta y)=\alpha Ax+\beta Ay
$$

입력을 먼저 조합하고 변환하든, 각각 변환한 뒤 같은 계수로 조합하든 결과가 같다. 따라서 원점은 반드시 원점으로 간다.

$$
A0=0
$$

고정된 벡터 b를 더하는 변환은 b가 0이 아닌 경우 affine transformation이다.

$$
T(x)=Ax+b
$$

이 변환은 일반적으로 원점을 보존하지 않는다. 나중에 제약식을 볼 때 선형 부분공간과 원점에서 이동한 집합을 구별하는 데 도움이 된다.

## 3. Range: 만들 수 있는 모든 출력

입력 계수를 자유롭게 바꿀 때 나오는 모든 출력의 집합이 **range**, 또는 column space다.

$$
\mathcal R(A)=\{Ax:x\in\mathbb R^n\}
=\operatorname{span}\{A_{\cdot1},\ldots,A_{\cdot n}\}\subseteq\mathbb R^m
$$

앞 절에서 열의 선형결합이라는 해석을 잡았으면 정의가 자연스럽다. 예를 들어

$$
B=\begin{bmatrix}1&2&3\\2&4&6\end{bmatrix}
$$

라면 두 번째 열은 첫 번째 열의 2배, 세 번째 열은 3배다. 따라서

$$
Bx=(x_1+2x_2+3x_3)\begin{bmatrix}1\\2\end{bmatrix}
$$

이고, 가능한 출력은 평면 전체가 아닌 하나의 직선이다.

$$
\mathcal R(B)=\operatorname{span}\left\{\begin{bmatrix}1\\2\end{bmatrix}\right\}
$$

출력 벡터의 <strong>성분 개수는 2</strong>지만 range의 <strong>차원은 1</strong>이다. 열이 세 개 있다고 독립적인 출력 방향도 세 개인 것은 아니다.

## 4. Null space: 곱하면 사라지는 입력

**Null space**, 또는 kernel은 출력이 영벡터가 되는 입력의 집합이다.

$$
\mathcal N(A)=\{x\in\mathbb R^n:Ax=0\}\subseteq\mathbb R^n
$$

range는 출력 공간 안에, null space는 입력 공간 안에 있다. B의 경우는

$$
x_1+2x_2+3x_3=0
$$

을 풀면 된다. 자유변수를 s, t로 두면

$$
x=\begin{bmatrix}-2s-3t\\s\\t\end{bmatrix}
=s\begin{bmatrix}-2\\1\\0\end{bmatrix}
+t\begin{bmatrix}-3\\0\\1\end{bmatrix}
$$

이다. 두 방향은 서로 독립이므로 null space는 3차원 입력 공간 안의 2차원 부분공간이다.

null space가 왜 해의 유일성과 연결될까? 어떤 입력 h가 null space에 있으면 원래 입력에 h를 더해도 출력이 바뀌지 않는다.

$$
Ah=0\quad\Longrightarrow\quad A(x+h)=Ax
$$

출력만 보고 x와 x+h를 구별할 수 없다. **영벡터 이외의 null space가 있으면 서로 다른 입력이 같은 출력으로 간다.**

## 5. Rank와 rank–nullity: 독립적인 출력과 사라지는 방향

rank는 range의 차원이다.

$$
\operatorname{rank}(A)=\dim\mathcal R(A)
$$

교안의 rank–nullity theorem은 입력 공간의 차원을 다음과 같이 연결한다.

$$
n=\operatorname{rank}(A)+\dim\mathcal N(A)
$$

B는 열이 세 개이고 rank가 1, nullity가 2이므로 3=1+2다. 이 식은 rank와 nullity라는 <strong>차원의 관계</strong>다. range와 null space가 같은 공간 안에 놓인다는 뜻은 아니다.

<strong>Full rank</strong>는 가능한 최대 rank를 갖는다는 뜻이다.

$$
\operatorname{rank}(A)=\min(m,n)
$$

| 조건 | 결과 |
| --- | --- |
| full column rank: rank = n | null space가 {0}, 가능한 출력에 대한 입력은 유일 |
| full row rank: rank = m | range가 전체 출력 공간, 모든 b에 대해 Ax=b를 풀 수 있음 |
| 정방행렬이고 rank = n | 모든 b에 대해 유일한 해, 역행렬 존재 |

직사각형 행렬이 full rank여도 양쪽 곱으로 항등행렬을 만드는 보통의 역행렬이 존재하는 것은 아니다. 행과 열의 개수를 먼저 확인한다.

## 6. 역행렬과 행렬식: 되돌릴 수 있는 변환인가?

n×n 정방행렬 A에 대해 다음을 만족하는 행렬이 있으면 가역이라고 한다.

$$
AA^{-1}=A^{-1}A=I_n
$$

가역이면 출력 b로부터 입력을 되찾을 수 있다.

$$
Ax=b\quad\Longrightarrow\quad x=A^{-1}b
$$

교안의 예제는 다음과 같다.

$$
A=\begin{bmatrix}3&2\\1&4\end{bmatrix},\qquad
A^{-1}=\frac1{10}\begin{bmatrix}4&-2\\-1&3\end{bmatrix}
$$

2×2 행렬의 determinant는 다음 식이다.

$$
\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc
$$

위의 A에서는 12−2=10이다. 정방행렬에서 다음 조건들은 동치다.

$$
\det(A)\ne0
\iff \operatorname{rank}(A)=n
\iff \mathcal N(A)=\{0\}
\iff A^{-1}\text{ exists}
$$

9월 9일 수업에서는 행렬식의 기하학적 의미도 설명했다. 2차원 단위 정사각형에 A를 적용하면 두 열벡터가 만드는 평행사변형이 된다. <strong>행렬식의 절댓값은 넓이의 배율</strong>이다. 더 높은 차원에서는 부피의 배율로 확장된다. 부호는 방향의 보존 또는 반전을 나타낸다.

행렬식이 0이면 차원이 눌려 넓이·부피가 0이 된다. 그러면 서로 다른 입력들이 겹쳐져 원래 입력을 유일하게 복원할 수 없다.

## 7. 고유벡터와 고유값: 특정 방향의 배율

정방행렬 A의 <strong>고유벡터</strong>는 다음을 만족하는 0이 아닌 벡터다.

$$
Av=\lambda v,\qquad v\ne0
$$

실수 고유벡터와 실수 고유값을 생각하면, 변환 결과가 원래 벡터와 같은 직선 위에 있다. 양의 고유값은 같은 방향의 배율, 음의 고유값은 방향 반전까지 포함한 배율이고, 0이면 그 방향이 사라진다.

영벡터는 어떤 행렬에서도 위 식을 만족하므로 고유벡터에서 제외한다. 또 일반 실수 행렬의 고유값·고유벡터는 복소수가 될 수도 있다. 이때는 실수 평면의 화살표 그림만으로 해석하기 어렵다.

고유값을 찾는 식은 특성방정식이다.

$$
\det(\lambda I-A)=0
$$

교안의 대칭행렬을 예로 들면

$$
S=\begin{bmatrix}1&-2\\-2&6\end{bmatrix}
$$

이고 특성다항식은

$$
\det(\lambda I-S)=(\lambda-1)(\lambda-6)-4
=\lambda^2-7\lambda+2
$$

이다. 따라서

$$
\lambda_1=\frac{7-\sqrt{41}}2\approx0.2984,\qquad
\lambda_2=\frac{7+\sqrt{41}}2\approx6.7016
$$

두 배율 모두 양수지만 방향별로 크기가 꽤 다르다. 고유값의 합과 곱으로 계산을 검산할 수도 있다. 고유값은 대수적 중복도를 포함해서 센다.

$$
\lambda_1+\lambda_2=7=\operatorname{tr}(S),\qquad
\lambda_1\lambda_2=2=\det(S)
$$

## 8. 대칭행렬: 직교하는 고유방향으로 좌표를 바꾸기

실수 대칭행렬은 전치해도 같다.

$$
S=S^T
$$

교안에서 강조하는 성질은 다음과 같다.

- 고유값이 모두 실수다.
- 서로 다른 고유값에 대응하는 고유벡터들은 직교한다.
- 고유값이 중복되어도, 각 고유공간에서 적절히 기저를 고르면 전체 공간의 정규직교 고유기저를 만들 수 있다.

마지막 성질까지 포함한 spectral theorem을 행렬로 쓰면 다음과 같다.

$$
S=Q\Lambda Q^T,\qquad Q^TQ=QQ^T=I
$$

Q의 열은 정규직교 고유벡터이고, Λ의 대각선에 대응 고유값들이 놓인다. Q의 열들이 전체 공간의 기저이므로 임의의 x를 이 좌표로 표현할 수 있다.

$$
c=Q^Tx,\qquad x=Qc
$$

앞 글에서 본 “정규직교기저와 내적하면 계수를 얻는다”는 계산이 그대로 다시 나온다.

중복 고유값에 속하는 벡터들이 <strong>처음부터 모두 직교한다</strong>는 뜻은 아니다. 그 고유공간 안에서 직교기저를 선택할 수 있다는 뜻이다.

## 9. 이차형식: 고유방향별 제곱 크기에 가중치를 주기

개인 필기에서 벡터의 제곱 노름 바로 옆에 등장했던 식이다.

$$
f(x)=x^TSx
$$

x는 n×1, S는 n×n이므로 결과는 1×1 스칼라다. 행렬 곱 Sx가 벡터를 만들고, 여기에 x를 내적한다.

대칭행렬을 고유기저로 분해하면 이 식의 의미가 선명해진다.

$$
\begin{aligned}
x^TSx
&=(Qc)^T(Q\Lambda Q^T)(Qc)\\
&=c^T\Lambda c\\
&=\sum_{i=1}^n\lambda_i c_i^2
\end{aligned}
$$

<strong>정규직교 고유방향별 성분의 제곱에 고유값을 가중치로 곱한 합</strong>이다. 직교하는 좌표를 선택해서 교차항을 없앤 것이다.

원래 좌표에서 S의 예제를 전개하면 다음과 같다.

$$
x^TSx=x_1^2-4x_1x_2+6x_2^2
=(x_1-2x_2)^2+2x_2^2
$$

교차항은 있지만 완전제곱으로 정리하면 0이 아닌 x에서 항상 양수임을 알 수 있다. 원래 좌표에서 교차항이 있다는 사실만으로 이차형식의 부호를 판단하면 안 된다.

## 10. PSD와 PD: 모든 방향에서의 부호 조건

이 수업에서는 실수 대칭행렬에 대해 PSD와 PD를 정의한다.

$$
S\succeq0\quad\Longleftrightarrow\quad
x^TSx\ge0\quad\text{for every }x\in\mathbb R^n
$$

$$
S\succ0\quad\Longleftrightarrow\quad
x^TSx>0\quad\text{for every }x\ne0
$$

첫 번째가 **positive semidefinite(양의 준정부호)**, 두 번째가 <strong>positive definite(양의 정부호)</strong>다. PD에서도 x=0을 넣으면 결과는 0이므로 정의에서 제외한다.

고유방향의 제곱합 표현으로부터 판정 조건을 얻는다.

$$
S\succeq0\iff\lambda_i\ge0\ (\text{all }i),\qquad
S\succ0\iff\lambda_i>0\ (\text{all }i)
$$

| 행렬 | 이차형식 | 판정 |
| --- | --- | --- |
| diag(3,1) | 3x₁²+x₂² | PD |
| diag(3,0) | 3x₁² | PSD, PD는 아님 |
| diag(1,−1) | x₁²−x₂² | indefinite: 방향에 따라 양수·음수 |

PSD는 <strong>원소들이 모두 0 이상</strong>이라는 조건이 아니다. 위에서 계산한 S는 음수 원소 −2를 포함하지만 PD다. 반대로 모든 원소가 양수여도 다음 행렬은 PSD가 아니다.

$$
H=\begin{bmatrix}1&2\\2&1\end{bmatrix},\qquad
\begin{bmatrix}1&-1\end{bmatrix}H\begin{bmatrix}1\\-1\end{bmatrix}=-2
$$

또한 행렬식이 양수라는 조건만으로도 부족하다. 예를 들어 −I₂는 행렬식이 1이지만 모든 0이 아닌 방향에서 이차형식이 음수다.

## 11. 왜 BᵀB와 outer product는 PSD일까?

교안의 마지막 연결은 행렬을 특정 형태로 만들면 PSD임을 바로 보일 수 있다는 것이다. 임의의 실수 행렬 B에 대해

$$
x^TB^TBx=(Bx)^T(Bx)=\|Bx\|_2^2\ge0
$$

이므로 BᵀB는 대칭 PSD다. B가 <strong>full column rank</strong>이면 0이 아닌 x를 영벡터로 보내지 않으므로 PD다. BBᵀ도 같은 방식으로 PSD이며, PD가 되려면 B가 full row rank여야 한다.

열벡터 a로 만든 outer product는 그 특수한 경우다.

$$
aa^T\in\mathbb R^{n\times n},\qquad
x^Taa^Tx=(a^Tx)^2\ge0
$$

내적 aᵀa는 스칼라지만 외적 aaᵀ는 행렬이다. 여기서 outer product는 3차원 cross product와 다른 연산이다.

a가 0이 아니면 aaᵀ의 rank는 1이다. n이 2 이상이면 a에 수직인 0이 아닌 방향이 존재하므로 그 방향에서 이차형식은 0이다. 따라서 보통 PSD이며, n≥2에서는 PD가 될 수 없다.

## 12. 정사영에서 최소제곱으로 이어 보기

여기부터는 앞 글과 이번 행렬 복습을 연결하는 보충 설명이다. Ac=b를 정확히 만족할 수 없으면 잔차의 제곱 노름을 최소화한다.

$$
\min_c\|Ac-b\|_2^2
$$

Ac는 A의 열벡터들이 만드는 공간 안에 있다. 따라서 이 문제는 b를 <strong>A의 range에 정사영</strong>하는 문제다. 최적 출력 p=Ac에서 잔차는 그 공간에 직교한다.

$$
A^T(b-Ac)=0\quad\Longrightarrow\quad A^TAc=A^Tb
$$

이것이 normal equations다. full column rank일 때 AᵀA가 PD이자 가역이므로 계수가 유일하게 정해진다.

$$
c^*=(A^TA)^{-1}A^Tb
$$

그런데 rank가 부족해도 <strong>정사영된 출력 p는 유일</strong>하다. 같은 출력을 만드는 계수 c가 여러 개일 수 있을 뿐이다. 정사영의 유일성과 계수의 유일성은 구분해야 한다.

수치 계산에서는 위 역행렬 식을 그대로 구현하기보다 QR이나 SVD를 사용하는 방법을 배울 수 있다. 여기서는 공식의 기하학적 의미와 가역 조건에 집중한다.

PSD와 최적화의 연결도 보인다. 실수 대칭 S에 대한 이차함수의 Hessian은 2S다.

$$
f(x)=x^TSx,\qquad \nabla f(x)=2Sx,\qquad \nabla^2f(x)=2S
$$

이 이차함수는 S가 PSD이면 convex이고, PD이면 strictly convex다. 선형대수 복습의 끝에서 PSD를 다루는 이유가 이후 목적함수의 곡률을 이해하는 데 있다는 것을 알 수 있다. 일반 함수의 convexity 조건과 알고리즘 수렴은 이후 단원에서 별도로 다룰 주제다.

## 13. 다시 풀어 볼 세 가지 질문

1. 2×3 행렬이 full row rank이면 역행렬이 있는가? 입력은 유일한가?
2. 대칭행렬의 고유값이 0, 2, 5이면 PSD인가, PD인가?
3. A가 full column rank가 아니어도 b의 range(A)로의 정사영은 유일한가?

**해설:** 1. 정방행렬이 아니므로 보통의 역행렬은 없다. rank–nullity로 nullity=1이므로 모든 출력에 대한 입력은 여러 개다. 2. PSD이며 PD는 아니다. 고유값 0에 해당하는 방향에서 이차형식이 0이 된다. 3. 유일하다. 여러 계수 벡터가 같은 정사영 벡터를 만들 수 있다.

## 참고한 수업 자료와 정리 범위

- ENAI601, **Module 1 — Linear Algebra**: Matrices, Matrix Multiplication, Range and Nullspace, Inverse, Determinant, Eigenvalues & Eigenvectors, Symmetric Matrices, PSD/PD와 outer product.
- **2026-09-09 수업 자동 캡션**: 행렬 곱의 열 조합 해석, range와 null space, 행렬식의 넓이 해석, 고유값과 대칭행렬, 최적화로 넘어가는 동기.
- **2026-09-02 수업 자동 캡션** 및 개인 필기 **「1 Vector」 2페이지**: 내적·노름과 행렬 곱·이차형식을 연결한 부분.
- ChatGPT 정리본 **「벡터를 외우지 않고 이해하기」**: 행렬로 이어지는 설명의 초안. 수식과 성립 조건은 교안 및 직접 계산으로 확인했다.

예제 B와 H, 완전제곱 전개, 최소제곱과 Hessian 연결은 이해를 위해 보강했다. 강의 원문이나 과제 해설을 전재하지 않고 개념의 흐름을 다시 설명했다.
